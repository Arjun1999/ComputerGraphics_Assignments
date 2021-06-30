import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Material 
{
    constructor(gl, Ka, Kd, Ks, shininessVal, a, b, c)
    {
        this.gl = gl;
        
        this.Ka = Ka;
        this.Kd = Kd;
        this.Ks = Ks;
        this.shininessVal = shininessVal;

        this.a = a;
        this.b = b;
        this.c = c;
        
    }

    setValues(shader)
    {
        const Ka = shader.uniform("Ka");
		const Kd = shader.uniform("Kd");
		const Ks = shader.uniform("Ks");
		const shininessVal = shader.uniform("shininessVal");

		const a = shader.uniform("a");
		const b = shader.uniform("b");
		const c = shader.uniform("c");


		shader.setUniform1f(Ka, this.Ka);
		shader.setUniform1f(Kd, this.Kd);
		shader.setUniform1f(Ks, this.Ks);
		shader.setUniform1f(shininessVal, this.shininessVal);
		
		shader.setUniform1f(a, this.a);
		shader.setUniform1f(b, this.b);
		shader.setUniform1f(c, this.c);

    }
}