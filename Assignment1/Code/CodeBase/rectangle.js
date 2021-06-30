import Transform from './transform.js'
import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Rectangle
{
	constructor(gl, centroidX, centroidY, width, height, color)
	{
		this.centroidX = centroidX;
		this.centroidY = centroidY;
		this.width = width;
		this.height = height;

		// Keeps track of minimum coordinates for a particular object.
		this.minx = this.centroidX - this.width / 2;
		this.maxx = this.centroidX + this.width / 2;
		this.miny = this.centroidY - this.height / 2;
		this.maxy = this.centroidY + this.height / 2;

		this.vertexAttributesData = new Float32Array
        ([
			 + width/2, + height/2, 0.0,
			 + width/2, - height/2, 0.0,
			 - width/2, + height/2, 0.0,
			 - width/2, - height/2, 0.0,

		]);

		this.gl = gl;
		this.color = color;

		this.vertexAttributesBuffer = this.gl.createBuffer();
		if (!this.vertexAttributesBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}

		// Creating Shapes via Translation
		this.transform = new Transform();
		this.transform.translate = vec3.fromValues(this.centroidX, this.centroidY, 0);
		this.transform.updateMVPMatrixLocal();
	}

	getCentroid()
	{

		return [this.centroidX, this.centroidY];
	}

	updateCentroid()
	{
		const currentVertex = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
		const updatedVertex = vec4.create();
		vec4.transformMat4(updatedVertex, currentVertex, this.transform.getMVPMatrix());

		// console.log("Original Vertex : ");
		// console.log(currentVertex);
		// console.log("Updated Vertex : ");
		// console.log(updatedVertex);

		this.centroidX = updatedVertex[0];
		this.centroidY = updatedVertex[1];

	}

	getMins()
	{
		return [this.minx, this.maxx, this.miny, this.maxy];
		
	}

	getShape()
	{
		if(this.height === this.width)
		{
			return "S";
		}

		else
		{
			return "R";
		}
	}

	draw(shader)
	{
		const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
		const uWorldTransformMatrix = shader.uniform("uWorldTransformMatrix");
		let elementPerVertex = 3;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3 * this.vertexAttributesData.BYTES_PER_ELEMENT, 0);
		
		shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());
		shader.setUniformMatrix4fv(uWorldTransformMatrix, this.transform.getWVMatrix());
		
        const uPrimitiveColor = shader.uniform("uPrimitiveColor");
        shader.setUniform3f(uPrimitiveColor, this.color);



		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexAttributesData.length / (elementPerVertex));
	}

	
}