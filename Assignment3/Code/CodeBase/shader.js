import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Shader
{
	constructor(gl, vertexShaderSrc, fragmentShaderSrc)
	{
		this.gl = gl;
		this.vertexShaderSrc = vertexShaderSrc;
		this.fragmentShaderSrc = fragmentShaderSrc;

		this.program = this.link(
			this.compile(gl.VERTEX_SHADER, this.vertexShaderSrc),
			this.compile(gl.FRAGMENT_SHADER, this.fragmentShaderSrc)

		);
	}

	compile(type, shaderSrc)
	{
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, shaderSrc);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
		{
			console.error(`Error while compiling shader ${shaderSrc}`);
			throw new Error(this.gl.getShaderInfoLog(shader));
		}

		return shader;
	}

	link(vertexShader, fragmentShader)
	{
		const program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);

		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
		{
			console.error(`Error while linking shaders`);
			throw new Error(this.gl.getProgramInfoLog(program));
		}

		this.gl.deleteShader(this.vertexShader);
		this.gl.deleteShader(this.fragmentShader);

		return program;
	}

	attribute(attributeName)
	{
		return this.gl.getAttribLocation(this.program, attributeName);
	}

	uniform(uniformName) 
	{
		return this.gl.getUniformLocation(this.program, uniformName);
	}

	setUniform1f(uniformLocation, float) 
	{
		this.gl.uniform1f(uniformLocation, float);
	}

	setUniform3f(uniformLocation, vec3) 
	{
		this.gl.uniform3f(uniformLocation, ...vec3);
	}

	setUniform4f(uniformLocation, vec4) 
	{
		this.gl.uniform4f(uniformLocation, ...vec4);
	}

	setUniformMatrix4fv(uniformLocation, mat4)
	{
		this.gl.uniformMatrix4fv(uniformLocation, false, mat4);
	}

	use()
	{
		this.gl.useProgram(this.program);
	}

	delete()
	{
		this.gl.deleteProgram(this.program);
	}
}