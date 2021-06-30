import Transform from './transform.js'
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Mesh
{
	constructor(gl, color, modelCode)
	{
		if (modelCode === "X" || modelCode === "Y" || modelCode === "Z")
		{
			var objStr = document.getElementById('axis.obj').innerHTML;
		}

		else if (modelCode === "A")
		{

			var objStr = document.getElementById('autumn.obj').innerHTML;
		}

		else if (modelCode === "W")
		{
			var objStr = document.getElementById('winter.obj').innerHTML;
		}

		else if (modelCode === "S") 
		{
			var objStr = document.getElementById('tree.obj').innerHTML;
		}

		this.meshData = new objLoader.Mesh(objStr);
		this.modelCode = modelCode;
		
		this.xcentre = 0.0;
		this.ycentre = 0.0;
		this.zcentre = 0.0;

		this.gl = gl;
		this.color = color;

		this.vertexAttributesBuffer = this.gl.createBuffer();
		
		if (!this.vertexAttributesBuffer) 
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}

		this.transform = new Transform();

		if (this.modelCode === "X")
		{
			this.transform.addRotation(- Math.PI/2, [0, 0, 1]);
		}

		if (this.modelCode === "Z") 
		{
			// this.transform.addRotation(- Math.PI / 2, [1, 0, 0]); // For mathematically accurate representation of Z axis 
			// this.transform.addRotation(- Math.PI / 2, [0, 1, 0]); // For mathematically accurate representation of Z axis

			this.transform.addRotation(3 * Math.PI / 4, [0, 0, 1]); // For better visual representation of Z axis

		}

		if (this.modelCode === "X" || this.modelCode === "Y" || this.modelCode === "Z")
		{
			this.transform.addScaling([1.35, 1.35, 1.35])
		}

		if (this.modelCode === "S" || this.modelCode === "W" || this.modelCode === "A")
		{
			this.transform.addScaling([0.2, 0.2, 0.2])
		}
	}

	getCentres()
	{

		return [this.xcentre, this.ycentre, this.zcentre];
	}


	updateCentres()
	{
		const currentVertex = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
		const updatedVertex = vec4.create();
		vec4.transformMat4(updatedVertex, currentVertex, this.transform.getWVMatrix());

		// console.log("Model Code : ");
		// console.log(this.modelCode);
		// console.log("Original Vertex : ");
		// console.log(currentVertex);
		// console.log("Updated Vertex : ");
		// console.log(updatedVertex);

		this.xcentre = updatedVertex[0];
		this.ycentre = updatedVertex[1];
		this.zcentre = updatedVertex[2];

	}

	draw(shader) 
	{	
		
		const uWorldTransformMatrix = shader.uniform("uWorldTransformMatrix");
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		
		let elementPerVertex = 3;
		objLoader.initMeshBuffers(this.gl, this.meshData)
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshData.vertexBuffer);
		this.gl.vertexAttribPointer(aPosition, this.meshData.vertexBuffer.itemSize , this.gl.FLOAT, false, 0, 0);
		
		shader.setUniformMatrix4fv(uWorldTransformMatrix, this.transform.getWVMatrix());

		const uPrimitiveColor = shader.uniform("uPrimitiveColor");
		shader.setUniform3f(uPrimitiveColor, this.color);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.meshData.indexBuffer);
		this.gl.drawElements(this.gl.TRIANGLES, this.meshData.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
		
	}
}
