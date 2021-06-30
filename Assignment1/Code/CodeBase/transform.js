import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform
{
	constructor()
	{
		// Model Transformation Initializations
		this.translate = vec3.fromValues( 0, 0, 0);
		this.scale = vec3.fromValues( 1, 1, 1);
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues( 0, 0, 1);

		// World Transform Initializations
		this.wtranslate1 = vec3.fromValues( 0, 0, 0);
		this.wtranslate2 = vec3.fromValues(0, 0, 0);
		this.wscale = vec3.fromValues( 1, 1, 1);
		this.wrotationAngle = 0;
		this.wrotationAxis = vec3.fromValues( 0, 0, 1);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.worldTransformMatrix = mat4.create();
		mat4.identity(this.worldTransformMatrix);

		this.updateMVPMatrix();
		this.updateWVMatrix();
	}

	getMVPMatrix()
	{
		return this.modelTransformMatrix;
	}

	getWVMatrix() 
	{
		return this.worldTransformMatrix;
	}

	// Used for Shape Creation
	updateMVPMatrixLocal()
	{
		mat4.identity(this.modelTransformMatrix);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
	}

	// Used for Shape Transformation
	updateMVPMatrix()
	{
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}

	// Used for Scene Transformation
	updateWVMatrix()
	{
		mat4.translate(this.worldTransformMatrix, this.worldTransformMatrix, this.wtranslate2);
		mat4.rotate(this.worldTransformMatrix, this.worldTransformMatrix, this.wrotationAngle, this.wrotationAxis);
		mat4.translate(this.worldTransformMatrix, this.worldTransformMatrix, this.wtranslate1);
	}

	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	setWTranslate1(translationVec)
	{
		this.wtranslate1 = translationVec;
	}

	setWTranslate2(translationVec)
	{
		this.wtranslate2 = translationVec;
	}

	getTranslate()
	{
		return this.translate;
	}

	getWTranslate1()
	{
		return this.wtranslate1;
	}

	getWTranslate2()
	{
		return this.wtranslate2;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	setWScale(scalingVec) 
	{
		this.wscale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}

	getWScale() 
	{
		return this.wscale;
	}

	setRotate(rotationAxis, rotationAngle)
	{
		this.rotationAngle = rotationAngle;
		this.rotationAxis = rotationAxis;
	}

	setWRotate(rotationAxis, rotationAngle)
	{
		this.wrotationAngle = rotationAngle;
		this.wrotationAxis = rotationAxis;
	}

	getRotate()
	{
		return this.rotate;
	}

	getWRotate()
	{
		return this.wrotate;
	}
}