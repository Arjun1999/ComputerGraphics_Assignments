import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform
{
	constructor()
	{
		// World Transformation Initializations
		this.translate = vec3.fromValues( 0, 0, 0);
		this.scale = vec3.fromValues( 1, 1, 1);
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues( 0, 0, 1);

		this.TTransformMatrix = mat4.create();
		mat4.identity(this.TTransformMatrix);
		
		this.RTransformMatrix = mat4.create();
		mat4.identity(this.RTransformMatrix);
		
		this.STransformMatrix = mat4.create();
		mat4.identity(this.STransformMatrix);
		
		this.worldTransformMatrix = mat4.create();
		mat4.identity(this.worldTransformMatrix);
		
		this.addTranslation(this.translate);
		this.addRotation(this.rotationAngle, this.rotationAxis);
		this.addScaling(this.scale);

	}

	addTranslation(translatevec)
	{
		mat4.identity(this.TTransformMatrix);
		const transMatrix = mat4.create();
		mat4.identity(transMatrix);

		const idenMatrix = mat4.create();
		mat4.identity(idenMatrix);

		mat4.translate(transMatrix, idenMatrix, translatevec);
		mat4.multiply(this.TTransformMatrix, this.TTransformMatrix, transMatrix);
	}

	addRotation(angle, axis)
	{
		mat4.identity(this.RTransformMatrix);

		const rotateMatrix = mat4.create();
		mat4.identity(rotateMatrix);

		const idenMatrix = mat4.create();
		mat4.identity(idenMatrix);

		mat4.rotate(rotateMatrix, idenMatrix, angle, axis);
		mat4.multiply(this.RTransformMatrix, this.RTransformMatrix, rotateMatrix);

	}

	addScaling(scalingvec)
	{
		mat4.identity(this.STransformMatrix);

		const scaleMatrix = mat4.create();
		mat4.identity(scaleMatrix);

		const idenMatrix = mat4.create();
		mat4.identity(idenMatrix);

		mat4.scale(scaleMatrix, idenMatrix, scalingvec);
		mat4.multiply(this.STransformMatrix, this.STransformMatrix, scaleMatrix);

	}

	makeIdentity()
	{
		mat4.identity(this.worldTransformMatrix);
	}

	getWVMatrix() 
	{
		mat4.identity(this.worldTransformMatrix);
		mat4.multiply(this.worldTransformMatrix, this.STransformMatrix, this.worldTransformMatrix);
		mat4.multiply(this.worldTransformMatrix, this.RTransformMatrix, this.worldTransformMatrix);
		mat4.multiply(this.worldTransformMatrix, this.TTransformMatrix, this.worldTransformMatrix);

		return this.worldTransformMatrix;
	}

	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	setRTransformMatrix(rotationMat)
	{
		this.RTransformMatrix = rotationMat;
	}

	getTranslate()
	{
		return this.translate;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}

	setRotate(rotationAxis, rotationAngle)
	{
		this.rotationAngle = rotationAngle;
		this.rotationAxis = rotationAxis;
	}

	getRotate()
	{
		return this.rotate;
	}

}
