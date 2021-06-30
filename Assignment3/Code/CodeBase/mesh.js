import Transform from './transform.js'
import Light from './light.js'
import Material from './material.js'
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Mesh
{
	constructor(gl, shader, shaderCode, color, modelCode, modelNumber, ambientColor, diffuseColor, specularColor, Ka, Kd, Ks, shininessVal, a, b, c, enabled)
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
		// console.log(this.meshData);

		this.num_indices = this.meshData.vertexMaterialIndices.length;
		const num_components_per_vertex = 3;

		this.minX = this.meshData.vertices[(0 * num_components_per_vertex) + 0];
		this.maxX = this.meshData.vertices[(0 * num_components_per_vertex) + 0];
		// console.log(this.minX);
		// console.log(this.maxX);

		this.minY = this.meshData.vertices[(0 * num_components_per_vertex) + 1];
		this.maxY = this.meshData.vertices[(0 * num_components_per_vertex) + 1];
		// console.log(this.minY);
		// console.log(this.maxY);

		this.minZ = this.meshData.vertices[(0 * num_components_per_vertex) + 2];
		this.maxZ = this.meshData.vertices[(0 * num_components_per_vertex) + 2];
		// console.log(this.minZ);
		// console.log(this.maxZ);

		for (var i = 0; i < this.num_indices; i++) 
        {
            if((this.meshData.vertices[(i * num_components_per_vertex) + 0]) < this.minX)
			{
				this.minX = this.meshData.vertices[(i * num_components_per_vertex) + 0];
			}

			if((this.meshData.vertices[(i * num_components_per_vertex) + 0]) > this.maxX)
			{
				this.maxX = this.meshData.vertices[(i * num_components_per_vertex) + 0];
			}

			if((this.meshData.vertices[(i * num_components_per_vertex) + 1]) < this.minY)
			{
				this.minY = this.meshData.vertices[(i * num_components_per_vertex) + 1];
			}

			if((this.meshData.vertices[(i * num_components_per_vertex) + 1]) > this.maxY)
			{
				this.maxY = this.meshData.vertices[(i * num_components_per_vertex) + 1];
			}

			if((this.meshData.vertices[(i * num_components_per_vertex) + 2]) < this.minZ)
			{
				this.minZ = this.meshData.vertices[(i * num_components_per_vertex) + 2];
			}

			if((this.meshData.vertices[(i * num_components_per_vertex) + 2]) > this.maxZ)
			{
				this.maxZ = this.meshData.vertices[(i * num_components_per_vertex) + 2];
			}
        }

		// console.log("MinX : ", this.minX);
		// console.log("MaxX : ", this.maxX);

		// console.log("MinY : ", this.minY);
		// console.log("MaxY : ", this.maxY);

		// console.log("MinZ : ", this.minZ);
		// console.log("MaxZ : ", this.maxZ);

		const alter_size_x = ((1.25 * (this.maxX - this.minX)) - (this.maxX - this.minX)) / 2.0;
		const alter_size_y = ((1.25 * (this.maxY - this.minY)) - (this.maxY - this.minY)) / 2.0;
		const alter_size_z = ((1.25 * (this.maxZ - this.minZ)) - (this.maxZ - this.minZ)) / 2.0;

		// console.log("Alter Size X : ", alter_size_x);
		// console.log("Alter Size Y : ", alter_size_y);
		// console.log("Alter Size Z : ", alter_size_z);
		
		const LightMinX = this.minX;
		const LightMaxX = this.maxX;

		const LightMinY = this.minY;
		const LightMaxY = this.maxY;
		
		const LightMinZ = this.minZ;
		const LightMaxZ = this.maxZ;

		this.light_xlow = LightMinX - alter_size_x;
		this.light_xhigh = LightMaxX + alter_size_x;

		this.light_ylow = LightMinY - alter_size_y;
		this.light_yhigh = LightMaxY + alter_size_y;

		this.light_zlow = LightMinZ - alter_size_z;
		this.light_zhigh = LightMaxZ + alter_size_z;

		this.modelCode = modelCode;
		this.modelNumber = modelNumber;
		this.shader = shader;
		this.shaderCode = shaderCode;

		// console.log("XLLow : ", this.light_xlow);
		// console.log("XLHigh : ", this.light_xhigh);

		// console.log("YLLow : ", this.light_ylow);
		// console.log("YLHigh : ", this.light_yhigh);

		// console.log("ZLLow : ", this.light_zlow);
		// console.log("ZLHigh : ", this.light_zhigh);

		// this.meshData.vertexBuffer.forEach( vertex =>
		// {
		// 	console.log(vertex);
		// }
		// );

		this.xcentre = 0.0;
		this.ycentre = 0.0;
		this.zcentre = 0.0;

		this.gl = gl;
		this.color = color;

		this.lightPos = vec3.fromValues((this.minX + this.maxX) / 2.0, (this.minY + this.maxY) / 2.0, (this.minZ + this.maxZ) / 2.0);

		// this.ambientColor = vec4.fromValues(0.094, 0.0, 0.0, 1.0);
		// this.diffuseColor = vec4.fromValues(0.5, 0.0, 0.0, 1.0);
		// this.specularColor = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
		
		// this.Ka = 0.1;
		// this.Kd = 0.6;
		// this.Ks = 0.7;
		// this.shininessVal = 20.0;

		// this.a = 1.0;
		// this.b = 0.0;
		// this.c = 0.0;

		this.pointLight = new Light(this.lightPos, ambientColor, diffuseColor, specularColor, enabled, this.light_xlow, this.light_xhigh, this.light_ylow, this.light_yhigh, this.light_zlow, this.light_zhigh);
		this.meshMaterial = new Material(this.gl, Ka, Kd, Ks, shininessVal, a, b, c);

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
			this.transform.addScaling([1, 1, 1])
		}
	}

	getCentres()
	{

		return [this.xcentre, this.ycentre, this.zcentre];
	}

	updateBoundingBox(scaleValue)
	{
		this.minX = this.minX * scaleValue;
		this.maxX = this.maxX * scaleValue;

		this.minY = this.minY * scaleValue;
		this.maxY = this.maxY * scaleValue;

		this.minZ = this.minZ * scaleValue;
		this.maxZ = this.maxZ * scaleValue;
	}

	checkScaling(scaleValue)
	{
		const alter_size_x = ((1.25 * ((this.maxX * scaleValue) - (this.minX * scaleValue))) - ((this.maxX * scaleValue) - (this.minX * scaleValue))) / 2.0;
		const alter_size_y = ((1.25 * ((this.maxY * scaleValue) - (this.minY * scaleValue))) - ((this.maxY * scaleValue) - (this.minY * scaleValue))) / 2.0;
		const alter_size_z = ((1.25 * ((this.maxZ * scaleValue) - (this.minZ * scaleValue))) - ((this.maxZ * scaleValue) - (this.minZ * scaleValue))) / 2.0;

		const new_light_xlow = (this.minX * scaleValue) - alter_size_x;
		const new_light_xhigh = (this.maxX * scaleValue) + alter_size_x;

		const new_light_ylow = (this.minY * scaleValue) - alter_size_y;
		const new_light_yhigh = (this.maxY * scaleValue) + alter_size_y;

		const new_light_zlow = (this.minZ * scaleValue) - alter_size_z;
		const new_light_zhigh = (this.maxZ * scaleValue) + alter_size_z;

		if((new_light_xlow < this.light_xlow) && (new_light_xhigh > this.light_xhigh) && (new_light_ylow < this.light_ylow) && (new_light_yhigh > this.light_yhigh) && (new_light_zlow < this.light_zlow) && (new_light_zhigh > this.light_zhigh))
		{
			return true;
		}

		else 
		{
			return false;
		}
	}

	getModelNumber()
	{
		return this.modelNumber;
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

		// For Normals
		const aVertexNormal = shader.attribute("aVertexNormal");
		this.gl.enableVertexAttribArray(aVertexNormal);

		let elementPerVertex = 3;
		objLoader.initMeshBuffers(this.gl, this.meshData)

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshData.vertexBuffer);
		this.gl.vertexAttribPointer(aPosition, this.meshData.vertexBuffer.itemSize , this.gl.FLOAT, false, 0, 0);

		// For Normals
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshData.normalBuffer);
		this.gl.vertexAttribPointer(aVertexNormal, this.meshData.normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		shader.setUniformMatrix4fv(uWorldTransformMatrix, this.transform.getWVMatrix());

		this.meshMaterial.setValues(shader);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.meshData.indexBuffer);
		this.gl.drawElements(this.gl.TRIANGLES, this.meshData.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

	}
}
