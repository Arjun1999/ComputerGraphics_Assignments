import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Light 
{
    constructor(lightPos, ambientColor, diffuseColor, specularColor, enabled, xlow, xhigh, ylow, yhigh, zlow, zhigh)
    {
        this.lightPos = lightPos;

        this.ambientColor = ambientColor;
        this.diffuseColor = diffuseColor;
        this.specularColor = specularColor;

        this.enabled = enabled;

        this.xlow = xlow;
        this.xhigh = xhigh;

        this.ylow = ylow;
        this.yhigh = yhigh;

        this.zlow = zlow;
        this.zhigh = zhigh;

    }

    setLightPos(newLightPos)
    {   
        let xval = newLightPos[0];
        let yval = newLightPos[1];
        let zval = newLightPos[2];

        if(newLightPos[0] < this.xlow)
        {
            xval = this.xlow;
        }

        if(newLightPos[0] > this.xhigh)
        {
            xval = this.xhigh;
        }

        if(newLightPos[1] < this.ylow)
        {
            yval = this.ylow;
        }

        if(newLightPos[1] > this.yhigh)
        {
            yval = this.yhigh;
        }

        if(newLightPos[2] < this.zlow)
        {
            zval = this.zlow;
        }

        if(newLightPos[2] > this.zhigh)
        {
            zval = this.zhigh;
        }

        this.lightPos = vec3.fromValues(xval, yval, zval);
    }
    
    getLightPos()
    {
        return this.lightPos;
    }

    switchOff()
    {
        this.enabled = 0.0;
    }

    switchOn()
    {
        this.enabled = 1.0;
    }

    // setValues(shader)
    // {
    //     const ulightPos = shader.uniform("ulightPos");
		
	// 	const ambientColor = shader.uniform("ambientColor");
	// 	const diffuseColor = shader.uniform("diffuseColor");
	// 	const specularColor = shader.uniform("specularColor");

    //  shader.setUniform3f(ulightPos, this.lightPos);

	// 	shader.setUniform3f(ambientColor, this.ambientColor);
	// 	shader.setUniform3f(diffuseColor, this.diffuseColor);
	// 	shader.setUniform3f(specularColor, this.specularColor);


    // }
}