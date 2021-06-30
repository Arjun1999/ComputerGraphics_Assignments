import Shader from './shader.js';
import vertexShaderSrcG from './vertexG.js';
import fragmentShaderSrcG from './fragmentG.js';
import vertexShaderSrcP from './vertexP.js';
import fragmentShaderSrcP from './fragmentP.js';
import Renderer from './renderer.js';
import Mesh from './mesh.js';
import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

const renderer = new Renderer();
const gl = renderer.webGlContext();

// Default Gouraud Shader 
const shaderg = new Shader(gl, vertexShaderSrcG, fragmentShaderSrcG);
shaderg.use();

// Default Phong Shader
const shaderp = new Shader(gl, vertexShaderSrcP, fragmentShaderSrcP);
// shaderp.program = shaderg.program;
// shaderp.use();

const viewMatrix = mat4.create();
mat4.identity(viewMatrix);
mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 20), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

const projectMatrix = mat4.create();
mat4.identity(projectMatrix);
mat4.perspective(projectMatrix, (45 * (Math.PI / 180)), (gl.canvas.width / gl.canvas.height), 0.1, 1000.0);

const uViewTransformMatrixG = shaderg.uniform("uViewTransformMatrix");
const uProjectionTransformMatrixG = shaderg.uniform("uProjectionTransformMatrix");

const uNormalMatrixG = shaderg.uniform("uNormalMatrix");
shaderg.setUniformMatrix4fv(uProjectionTransformMatrixG, projectMatrix);

shaderp.use();
const uViewTransformMatrixP = shaderp.uniform("uViewTransformMatrix");
const uProjectionTransformMatrixP = shaderp.uniform("uProjectionTransformMatrix");

const uNormalMatrixP = shaderp.uniform("uNormalMatrix");
shaderp.setUniformMatrix4fv(uProjectionTransformMatrixP, projectMatrix);

var angle = 0;

let primitives_axes = [];
let primitives_models = [];
let primitives = [];

let shapeMode = "N";
let selectionMode = "n";
let systemMode = 0;
let shaderMode = 0;
let applicationRunning = 1;
let selectedMeshID = 2;

let translationDelta = 0.15;
let translationDeltaLight = 0.15;

let ScaleValue = 1.0;
let ScaleDelta = 0.1;

let mouseX = -1;
let mouseY = -1;

let Mdrag = 0;
let StartX;
let StartY;

let CameraX;
let CameraY;
let CameraZ;
let ClickI = 0;

const uLightG = [];
const uLightP = [];

console.log("Welcome to Illuminator.\n");
console.log("The Application has 2 modes : Scene Setting and Shader Selection Mode (Mode 0) and Model Transformation and Illumination Mode (Mode 1).\n");
console.log("You are currently in Mode 0 by default.\nUse 'm' to toggle between modes.\n");
console.log("------ Mode 0 Instruction Set ----------\n");
console.log("C : Draw Models.\n");
console.log("c : Delete Models.\n");
console.log("s : Toggle between Shaders. The Gourad Shader is set as the default shader.\n");


console.log("------ Mode 1 Instruction Set ----------\n");
console.log("Press keys 7, 8 or 9 to Select between Spring, Winter or Autumn Model.\n");
console.log("Arrow Keys and < , > : Translate Models.\n");
console.log("+, - : Scale Models.\n");
console.log("Left Click and Drag to use Trackball Rotation for Selected Model.\n");
console.log("I : Switch to Illuminator Mode.\n");
console.log("q, w : Translate Selected Model's Light Source along the X axis. Can only be used in Illuminator mode.\n");
console.log("a, s : Translate Selected Model's Light Source along the Y axis. Can only be used in Illuminator mode.\n");
console.log("z, x : Translate Selected Model's Light Source along the Z axis. Can only be used in Illuminator mode.\n");
console.log("0, 1 : To Switch Off/On the Selected Model's Light Source. Can only be used in Illuminator mode.\n");

console.log("You can press Esc at anytime to quit the application.\n");

Trackball.RotationWithQuaternion.onRotationChanged = function (updatedRotationMatrix) 
{
	// console.log("TrackBall : ", updatedRotationMatrix);
	
	primitives_models.forEach(primitive =>
	{
		if((primitive.modelNumber) === selectedMeshID)
		{	
			// console.log("MeshNum ", primitive.modelNumber);
			// console.log("SelMeshID ", selectedMeshID);
			primitive.transform.setRTransformMatrix(updatedRotationMatrix);
		}		
	});
	
}


window.onload = () =>
{
	renderer.getCanvas().addEventListener('click', (event) =>
	{

		const rect = renderer.getCanvas().getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;

		if(systemMode === 0)
		{
			// Adding Models
			if(shapeMode === "C")
			{
				if(primitives_models.length === 0)
				{
					const colorW = new Float32Array([153.0 / 255.0, 1.0, 1.0]);
					const colorS = new Float32Array([154.0 / 255.0, 205.0 / 255.0, 50.0 / 255.0]);
					const colorA = new Float32Array([165.0 / 255.0, 42.0 / 255.0, 42.0/ 255.0]);

					const meshS = new Mesh(gl, shaderg, "G", colorS, "S", 7, vec4.fromValues(154.0 / 255.0, 205.0 / 255.0, 50.0 / 255.0), vec4.fromValues(154.0 / 255.0, 205.0 / 255.0, 50.0 / 255.0), vec4.fromValues(1.0, 1.0 , 1.0, 1.0), 0.157, 0.54, 0.553, 32.0, 1.0, 0.0, 0.0, 1.0);
					const meshW = new Mesh(gl, shaderg, "G", colorW, "W", 8, vec4.fromValues(0.7, 0.7, 0.7, 1.0), vec4.fromValues(153.0 / 255.0, 1.0, 1.0), vec4.fromValues(1.0, 1.0 , 1.0, 1.0), 0.329, 0.780, 0.992, 27.897, 1.0, 0.3, 0.5, 1.0);
					const meshA = new Mesh(gl, shaderg, "G", colorA, "A", 9, vec4.fromValues(0.3, 0.3, 0.3, 1.0), vec4.fromValues(165.0 / 255.0, 42.0 / 255.0, 42.0/ 255.0), vec4.fromValues(1.0, 1.0 , 1.0, 1.0), 0.231, 0.278, 0.774, 89.6, 1.0, 1.0, 0.7, 1.0);

					shaderg.use();		
					for (var i = 0; i < 3; i++) 
					{
						uLightG[i] = {};
	
						uLightG[i].position = shaderg.uniform("light[" + i + "].position");
						uLightG[i].ambient = shaderg.uniform("light[" + i + "].ambient");
						uLightG[i].diffuse = shaderg.uniform("light[" + i + "].diffuse");
						uLightG[i].specular = shaderg.uniform("light[" + i + "].specular");
						uLightG[i].enabled = shaderg.uniform("light[" + i + "].enabled");

						
					}

					shaderp.use();
					for (var i = 0; i < 3; i++)
					{
						uLightP[i] = {};   
						
						uLightP[i].position = shaderp.uniform("light[" + i + "].position");
						uLightP[i].ambient = shaderp.uniform("light[" + i + "].ambient");
						uLightP[i].diffuse = shaderp.uniform("light[" + i + "].diffuse");
						uLightP[i].specular = shaderp.uniform("light[" + i + "].specular");
						uLightP[i].enabled = shaderp.uniform("light[" + i + "].enabled");
						
					}

					// console.log("ULight : ", uLight);

					primitives.push(meshS);
					primitives.push(meshW);
					primitives.push(meshA);

					primitives_models.push(meshS);
					primitives_models.push(meshW);
					primitives_models.push(meshA);

					shaderg.use();
					primitives_models.forEach(primitive =>
					{
						// console.log(primitive.modelNumber);
						// primitive.meshMaterial.setValues(shader);
						// console.log(primitive.pointLight.lightPos);
						// console.log(primitive.pointLight.ambientColor);
						// console.log(primitive.pointLight.diffuseColor);
						// console.log(primitive.pointLight.specularColor);
						// console.log(primitive.pointLight.enabled);
						
						shaderg.setUniform3f(uLightG[primitive.modelNumber - 7].position, primitive.pointLight.lightPos);
						shaderg.setUniform4f(uLightG[primitive.modelNumber - 7].ambient, primitive.pointLight.ambientColor);
						shaderg.setUniform4f(uLightG[primitive.modelNumber - 7].diffuse, primitive.pointLight.diffuseColor);
						shaderg.setUniform4f(uLightG[primitive.modelNumber - 7].specular, primitive.pointLight.specularColor);
						shaderg.setUniform1f(uLightG[primitive.modelNumber - 7].enabled, primitive.pointLight.enabled);

					});

					shaderp.use();
					primitives_models.forEach(primitive =>
					{
						
						shaderp.setUniform3f(uLightP[primitive.modelNumber - 7].position, primitive.pointLight.lightPos);
						shaderp.setUniform4f(uLightP[primitive.modelNumber - 7].ambient, primitive.pointLight.ambientColor);
						shaderp.setUniform4f(uLightP[primitive.modelNumber - 7].diffuse, primitive.pointLight.diffuseColor);
						shaderp.setUniform4f(uLightP[primitive.modelNumber - 7].specular, primitive.pointLight.specularColor);
						shaderp.setUniform1f(uLightP[primitive.modelNumber - 7].enabled, primitive.pointLight.enabled);
					
					});
				}
			}

		
			// Removing Models
			else if (shapeMode === "X")
			{

				primitives = [];
				// primitives_axes = [];
				primitives_models = [];
			}

		
		}

		else if (systemMode === 1)
		{

			if (shapeMode === "T")
			{
				if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();

					// console.log("Model Code : ");
					// console.log(primitive.modelCode);
					// console.log("Centres : ");
					// console.log(primitive_centres);

					// console.log(primitive.transform.getTranslate());
					// console.log("Primitive Model Number : ", primitive.modelNumber);
					// console.log("Selected Mesh ID : ", selectedMeshID);
					
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						// console.log(primitive.modelNumber);
						let newTranslate = vec3.fromValues(0.0, 0.0, 0.0);
			
						vec3.add(newTranslate, primitive.transform.getTranslate(), translationDelta);
						// console.log("New Trans : ", newTranslate);
			
						primitive.transform.setTranslate(newTranslate);
						primitive.transform.addTranslation(primitive.transform.getTranslate());
						
						// console.log(primitive.transform.getTranslate());
						// primitive.transform.addTranslation([1.5 , 0 , 0 ]);
						primitive.updateCentres();
					}

					// else if (primitive.modelCode === "W")
					// {
					// 	primitive.transform.addTranslation([-1.5, -1.5 , 0 ]);
					// 	primitive.updateCentres();
					// }

					// else if (primitive.modelCode === "A")
					// {
					// 	primitive.transform.addTranslation([0 , 1.5 , 0 ]);
					// 	primitive.updateCentres();
					// }

				});
			}

			else if (shapeMode === "E")
			{
					primitives.forEach(primitive =>
					{
						let primitive_centres = primitive.getCentres();

						if (primitive.modelCode === "S")
						{
							// 0, -0.125, 0
							primitive.transform.addTranslation([0 , -0.75 , 0 ]);
							primitive.updateCentres();
						}

						else if (primitive.modelCode === "W")
						{
							// -0.125, 0, 0
							primitive.transform.addTranslation([-0.75, 0, 0]);
							primitive.updateCentres();
						}

						else if (primitive.modelCode === "A")
						{
							// 0.125, 0.125, 0
							primitive.transform.addTranslation([0.75, 0.75, 0]);
							primitive.updateCentres();
						}

					});
			}

			else if (shapeMode === "G")
			{
					primitives.forEach(primitive =>
					{
						let primitive_centres = primitive.getCentres();

						if (primitive.modelCode === "S")
						{
							// 0, -0.125, 0
							// primitive.transform.addTranslation([0 , -0.75 , 0 ]);
							primitive.transform.addScaling([0.1, 0.1, 0.1]);
							primitive.updateCentres();
						}

						else if (primitive.modelCode === "W")
						{
							// -0.125, 0, 0
							primitive.transform.addScaling([0.4, 0.4, 0.4]);
							primitive.updateCentres();
						}

						else if (primitive.modelCode === "A")
						{
							// 0.125, 0.125, 0
							primitive.transform.addScaling([0.6, 0.6, 0.6]);
							primitive.updateCentres();
						}

					});
			}


		}

	});

	renderer.getCanvas().addEventListener('mousedown', (event) =>
	{
		if(shapeMode === "A" && systemMode === 1)
		{
			gl.enable(gl.DEPTH_TEST);

			if(ClickI === 0)
			{
				mat4.identity(viewMatrix);
				mat4.lookAt(viewMatrix, vec3.fromValues(20, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
			}

			else if(ClickI > 0)
			{
				mat4.identity(viewMatrix);
				mat4.lookAt(viewMatrix, vec3.fromValues(CameraX, CameraY, CameraZ), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
			}

			var x = event.clientX;
			var y = event.clientY;
			var Rect = event.target.getBoundingClientRect();

			var clipCoordinates = renderer.mouseToClipCoord(x, y);

          	var clipX = clipCoordinates[0];
          	var clipY = clipCoordinates[1];


			if(Rect.left <= x && x <= Rect.right && Rect.top <= y && y <= Rect.bottom)
			{
				StartX = clipX;
				StartY = clipY;
				Mdrag = 1;
			}

		}

		else
		{
			gl.disable(gl.DEPTH_TEST);
			// mat4.identity(viewMatrix);
			// mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 20), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

		}

	});

	renderer.getCanvas().addEventListener('mouseup', (event) =>
	{
		Mdrag = 0;
		if (shapeMode === "A" && systemMode === 1)
		{
			ClickI += 1;
		}

		else
		{
			ClickI = 0;
		}
	});

	renderer.getCanvas().addEventListener('mousemove', (event) =>
	{
		if (shapeMode === "A" && systemMode === 1)
		{
			gl.enable(gl.DEPTH_TEST);

			var x = event.clientX;
			var y = event.clientY;

			var clipCoordinates = renderer.mouseToClipCoord(x, y);

          	var clipX = clipCoordinates[0];
			var clipY = clipCoordinates[1];
			var scalef = 0.5;

			if(Mdrag === 1)
			{

				CameraY = 0;

				let dist = (Math.sqrt(Math.pow((clipX - StartX), 2) + Math.pow((clipY - StartY), 2))) % scalef;
				let deg = (dist * 360) / scalef;
				let rad = (deg * Math.PI) / 180;

				if(clipX >= StartX)
				{
					CameraX = 20 * Math.cos(rad);
					CameraZ = 20 * Math.sin(rad);
				}

				if(clipX < StartX)
				{
					CameraX = -20 * Math.cos(rad);
					CameraZ = -20 * Math.sin(rad);
				}

				mat4.identity(viewMatrix);
				mat4.lookAt(viewMatrix, vec3.fromValues(CameraX, CameraY, CameraZ), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

			}
		}
	});

	window.addEventListener("keydown", function(event)
	{
	  switch (event.key) 
	  {

      case "C":
        if (applicationRunning === 1 && systemMode === 0) 
		{
		  console.log("You have opted to draw Models.");
		  shapeMode = "C";
        }

        break;

      case "ArrowRight":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();
					if((primitive.modelNumber) === selectedMeshID)
					{	
						let newTranslate = vec3.fromValues(0.0, 0.0, 0.0);
						let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
			
						vec3.add(newTranslate, primitive.transform.getTranslate(), vec3.fromValues(translationDelta, 0.0, 0.0));
						vec3.add(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(translationDelta, 0.0, 0.0));
			
						primitive.transform.setTranslate(newTranslate);
						primitive.pointLight.setLightPos(newLightPos);
						primitive.transform.addTranslation(primitive.transform.getTranslate());
						
						primitive.updateCentres();
					}

				});
        }


        break;

	  case "ArrowLeft":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						let newTranslate = vec3.fromValues(0.0, 0.0, 0.0);
						let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
			
						vec3.subtract(newTranslate, primitive.transform.getTranslate(), vec3.fromValues(translationDelta, 0.0, 0.0));
						vec3.subtract(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(translationDelta, 0.0, 0.0));
			
						primitive.transform.setTranslate(newTranslate);
						primitive.pointLight.setLightPos(newLightPos);
						primitive.transform.addTranslation(primitive.transform.getTranslate());
						
						primitive.updateCentres();
					}

				});
        }


        break;

	   case "ArrowUp":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						let newTranslate = vec3.fromValues(0.0, 0.0, 0.0);
						let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
			
						vec3.add(newTranslate, primitive.transform.getTranslate(), vec3.fromValues(0.0, translationDelta, 0.0));
						vec3.add(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(0.0, translationDelta, 0.0));

						primitive.transform.setTranslate(newTranslate);
						primitive.pointLight.setLightPos(newLightPos);
						primitive.transform.addTranslation(primitive.transform.getTranslate());
						
						primitive.updateCentres();
					}

				});
        }


        break;

	  case "ArrowDown":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						let newTranslate = vec3.fromValues(0.0, 0.0, 0.0);
						let newLightPos = vec3.fromValues(0.0, 0.0, 0.0)
			
						vec3.subtract(newTranslate, primitive.transform.getTranslate(), vec3.fromValues(0.0, translationDelta, 0.0));
						vec3.subtract(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(0.0, translationDelta, 0.0));
			
						primitive.transform.setTranslate(newTranslate);
						primitive.pointLight.setLightPos(newLightPos);
						primitive.transform.addTranslation(primitive.transform.getTranslate());
						
						primitive.updateCentres();
					}

				});
        }


        break;

      case ">":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						let newTranslate = vec3.fromValues(0.0, 0.0, 0.0);
						let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
			
						vec3.add(newTranslate, primitive.transform.getTranslate(), vec3.fromValues(0.0, 0.0, translationDelta));
						vec3.add(newLightPos, primitive.transform.getTranslate(), vec3.fromValues(0.0, 0.0, translationDelta));
			
						primitive.transform.setTranslate(newTranslate);
						primitive.pointLight.setLightPos(newLightPos);
						primitive.transform.addTranslation(primitive.transform.getTranslate());
						
						primitive.updateCentres();
					}

				});
        }


        break;

      case "<":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						let newTranslate = vec3.fromValues(0.0, 0.0, 0.0);
						let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
			
						vec3.subtract(newTranslate, primitive.transform.getTranslate(), vec3.fromValues(0.0, 0.0, translationDelta));
						vec3.subtract(newLightPos, primitive.transform.getTranslate(), vec3.fromValues(0.0, 0.0, translationDelta));
			
						primitive.transform.setTranslate(newTranslate);
						primitive.pointLight.setLightPos(newLightPos);
						primitive.transform.addTranslation(primitive.transform.getTranslate());
						
						primitive.updateCentres();
					}

				});
        }


        break;

		case "+":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						// console.log("Check Sup : ", primitive.checkScaling(ScaleValue + ScaleDelta));
						// console.log("SVal : ", (ScaleValue + ScaleDelta));
						if(primitive.checkScaling(ScaleValue + ScaleDelta))
						{	
							primitive.transform.addScaling([ScaleValue + ScaleDelta, ScaleValue + ScaleDelta, ScaleValue + ScaleDelta]);
							primitive.updateBoundingBox(ScaleValue + ScaleDelta);
							ScaleValue = ScaleValue + ScaleDelta;
						}
					}

				});
        }
		break;

		case "-":
        if (applicationRunning === 1 && systemMode === 1)
		{
		  		if(selectedMeshID === 2)
				{
						console.log("Choose a model by pressing 7,8 or 9.");
				}


				primitives_models.forEach( primitive =>
				{
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						if(primitive.checkScaling(ScaleValue - ScaleDelta))
						{	
							primitive.transform.addScaling([ScaleValue - ScaleDelta, ScaleValue - ScaleDelta, ScaleValue - ScaleDelta]);
							primitive.updateBoundingBox(ScaleValue - ScaleDelta);
							ScaleValue = ScaleValue - ScaleDelta;
						}
					}

				});
        }
		break;

      	case "I":
        if (applicationRunning === 1 && systemMode === 1) 
		{
          console.log("You are now in the Illuminator mode.");
		  shapeMode = "I";
        }


        break;

      	case "q":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I")
		{
			if(selectedMeshID === 2)
			{
					console.log("Choose a model by pressing 7,8 or 9.");
			}

			primitives_models.forEach( primitive =>
			{
				let primitive_centres = primitive.getCentres();
				
				if((primitive.modelNumber) === selectedMeshID)
				{	
					let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
		
					vec3.subtract(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(translationDeltaLight, 0.0, 0.0));
		
					primitive.pointLight.setLightPos(newLightPos);
				}

			});
        }

        break;

		case "w":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I")
		{
			if(selectedMeshID === 2)
			{
					console.log("Choose a model by pressing 7,8 or 9.");
			}

			primitives_models.forEach( primitive =>
			{
				let primitive_centres = primitive.getCentres();
				
				if((primitive.modelNumber) === selectedMeshID)
				{	
					let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
		
					vec3.add(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(translationDeltaLight, 0.0, 0.0));
		
					primitive.pointLight.setLightPos(newLightPos);
					
					// console.log(primitive.pointLight.lightPos);
					// console.log("Xhigh : ", primitive.pointLight.xhigh);
				}

			});
        }

        break;

		case "a":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I")
		{
			if(selectedMeshID === 2)
			{
					console.log("Choose a model by pressing 7,8 or 9.");
			}

			primitives_models.forEach( primitive =>
			{
				let primitive_centres = primitive.getCentres();
				
				if((primitive.modelNumber) === selectedMeshID)
				{	
					let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
		
					vec3.subtract(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(0.0, translationDeltaLight, 0.0));
		
					primitive.pointLight.setLightPos(newLightPos);
				}

			});
        }

        break;

		case "s":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I")
		{
			if(selectedMeshID === 2)
			{
					console.log("Choose a model by pressing 7,8 or 9.");
			}

			primitives_models.forEach( primitive =>
			{
				let primitive_centres = primitive.getCentres();
				
				if((primitive.modelNumber) === selectedMeshID)
				{	
					let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
		
					vec3.add(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(0.0, translationDeltaLight, 0.0));
		
					primitive.pointLight.setLightPos(newLightPos);
				}

			});
        }

		else if (applicationRunning === 1 && systemMode === 0)
		{
			if(selectedMeshID === 2)
			{
					console.log("Choose a model by pressing 7,8 or 9.");
			}

			primitives_models.forEach( primitive =>
			{
				
				if((primitive.modelNumber) === selectedMeshID)
				{	
					if(primitive.shaderCode === "G")
					{
						primitive.shaderCode = "P";
						primitive.shader = shaderp;
						console.log("The shader for model number " + selectedMeshID + " is now Phong.");
					}

					else if(primitive.shaderCode === "P")
					{
						primitive.shaderCode = "G";
						primitive.shader = shaderg;
						console.log("The shader for model number " + selectedMeshID + " is now Gourad.");
					}
				}

			});
        }

        break;

		case "z":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I")
		{
			if(selectedMeshID === 2)
			{
					console.log("Choose a model by pressing 7,8 or 9.");
			}

			primitives_models.forEach( primitive =>
			{
				let primitive_centres = primitive.getCentres();
				
				if((primitive.modelNumber) === selectedMeshID)
				{	
					let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
		
					vec3.subtract(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(0.0, 0.0, translationDeltaLight));
		
					primitive.pointLight.setLightPos(newLightPos);
				}

			});
        }

        break;

		case "x":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I")
		{
			if(selectedMeshID === 2)
			{
					console.log("Choose a model by pressing 7,8 or 9.");
			}

			primitives_models.forEach( primitive =>
			{
				let primitive_centres = primitive.getCentres();
				
				if((primitive.modelNumber) === selectedMeshID)
				{	
					let newLightPos = vec3.fromValues(0.0, 0.0, 0.0);
		
					vec3.add(newLightPos, primitive.pointLight.getLightPos(), vec3.fromValues(0.0, 0.0, translationDeltaLight));
		
					primitive.pointLight.setLightPos(newLightPos);
				}

			});
        }

        break;

		case "0":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I") 
		{
		  	
		  if(selectedMeshID === 2)
		  {
			console.log("Choose a model by pressing 7,8 or 9.");
		  }

		  else
		  {
			primitives_models.forEach( primitive =>
				{
					let primitive_centres = primitive.getCentres();
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						primitive.pointLight.switchOff();
					}

				});

			console.log("You have switched off the light for the selected model.");
		  }
        }

		break;

		case "1":
        if (applicationRunning === 1 && systemMode === 1 && shapeMode === "I") 
		{
		  	
		  if(selectedMeshID === 2)
		  {
			console.log("Choose a model by pressing 7,8 or 9.");
		  }

		  else 
		  {
			primitives_models.forEach( primitive =>
				{
					
					if((primitive.modelNumber) === selectedMeshID)
					{	
						primitive.pointLight.switchOn();
					}

				});

			console.log("You have switched on the light for the selected model.");
		  }
        }

		break;

		case "7":
        if (applicationRunning === 1) 
		{
          console.log("You have selected Spring Model.");
		  selectedMeshID = 7;
        }


        break;
		
		case "8":
        if (applicationRunning === 1) 
		{
          console.log("You have selected Winter Model.");
		  selectedMeshID = 8;
        }


        break;
		
		case "9":
        if (applicationRunning === 1) 
		{
          console.log("You have selected Autumn Model.");
		  selectedMeshID = 9;
        }


        break;
		
        case "X":
        if (applicationRunning === 1 && systemMode === 0) 
		{
		 console.log("You have opted to clear Screen.");
		 shapeMode = "X";
        }


        break;

      case "m":
        systemMode = (systemMode + 1) % 2;

        if (applicationRunning === 1) 
		{
          if (systemMode === 0) 
		  {
            console.log("Scene Setting and Shader Selection : Mode ", systemMode);
          } 
		  else if (systemMode === 1) 
		  {
            console.log("Mesh Transformation and Illuminator Mode : Mode ", systemMode);
          }

		}
		break;

	  
      case "Escape":
		if(applicationRunning === 1)
		{
			applicationRunning = 0;
			shapeMode = "N";
			selectionMode = "n";
			console.log( "You have opted to close the application \nThank you for your time\n");
		}
		break;
    }
	},
		true
	);
};


gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);



//Draw loop
function animate()
{
	if(applicationRunning === 1)
	{
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		renderer.clear();

		
		shaderg.use();
		primitives_models.forEach(primitive =>
		{
			const normalMatrix = mat4.create();
			mat4.multiply(normalMatrix, viewMatrix, primitive.transform.getWVMatrix());
			mat4.invert(normalMatrix, normalMatrix);
			mat4.transpose(normalMatrix, normalMatrix);

			
			shaderg.setUniform3f(uLightG[primitive.modelNumber - 7].position, primitive.pointLight.lightPos);
			shaderg.setUniform4f(uLightG[primitive.modelNumber - 7].ambient, primitive.pointLight.ambientColor);
			shaderg.setUniform4f(uLightG[primitive.modelNumber - 7].diffuse, primitive.pointLight.diffuseColor);
			shaderg.setUniform4f(uLightG[primitive.modelNumber - 7].specular, primitive.pointLight.specularColor);
			shaderg.setUniform1f(uLightG[primitive.modelNumber - 7].enabled, primitive.pointLight.enabled);

			shaderg.setUniformMatrix4fv(uViewTransformMatrixG, viewMatrix);
			shaderg.setUniformMatrix4fv(uNormalMatrixG, normalMatrix);

			// console.log("Primitive Code : ", primitive.modelNumber, " Primitive PointLight : ", primitive.pointLight.lightPos);
			
		});
		
		
		shaderp.use()
		primitives_models.forEach(primitive =>
		{
			const normalMatrix = mat4.create();
			mat4.multiply(normalMatrix, viewMatrix, primitive.transform.getWVMatrix());
			mat4.invert(normalMatrix, normalMatrix);
			mat4.transpose(normalMatrix, normalMatrix);

			shaderp.setUniform3f(uLightP[primitive.modelNumber - 7].position, primitive.pointLight.lightPos);
			shaderp.setUniform4f(uLightP[primitive.modelNumber - 7].ambient, primitive.pointLight.ambientColor);
			shaderp.setUniform4f(uLightP[primitive.modelNumber - 7].diffuse, primitive.pointLight.diffuseColor);
			shaderp.setUniform4f(uLightP[primitive.modelNumber - 7].specular, primitive.pointLight.specularColor);
			shaderp.setUniform1f(uLightP[primitive.modelNumber - 7].enabled, primitive.pointLight.enabled);

			shaderp.setUniformMatrix4fv(uViewTransformMatrixP, viewMatrix);
			shaderp.setUniformMatrix4fv(uNormalMatrixP, normalMatrix);
			// console.log("Primitive Code : ", primitive.modelNumber, " Primitive PointLight : ", primitive.pointLight.enabled);
			// console.log("Primitive Code : ", primitive.modelNumber, " Primitive PointLight : ", primitive.pointLight.lightPos);
			
			
		});	

		shaderg.use();
		primitives_models.forEach(primitive =>
		{
				if(primitive.shaderCode === "G")
				{
					primitive.draw(shaderg);
				}
		});
		
		shaderp.use();
		primitives_models.forEach(primitive =>
		{
				if(primitive.shaderCode === "P")
				{
					primitive.draw(shaderp);
				}
		});

		window.requestAnimationFrame(animate);
	}

	else
	{
		renderer.clear();
	}
}

animate();

// shaderg.delete();
// shaderp.delete();
