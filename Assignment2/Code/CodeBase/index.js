import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Mesh from './mesh.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

const renderer = new Renderer();
const gl = renderer.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();

const viewMatrix = mat4.create();
mat4.identity(viewMatrix);
mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 20), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

const projectMatrix = mat4.create();
mat4.identity(projectMatrix);
mat4.perspective(projectMatrix, (45 * (Math.PI / 180)), (gl.canvas.width / gl.canvas.height), 0.1, 1000.0);

var angle = 0; 

let primitives_axes = [];
let primitives_models = [];
let primitives = [];

let shapeMode = "N";
let selectionMode = "n";
let systemMode = 0;
let applicationRunning = 1;

let mouseX = -1;
let mouseY = -1;

let Mdrag = 0;
let StartX;
let StartY;

let CameraX;
let CameraY;
let CameraZ;
let ClickI = 0;


console.log("Welcome to Simple 3D Model Viewer.\n");
console.log("The Application has 2 modes : Scene Setting Mode (Mode 0) and Object Manipulation Mode (Mode 1).\n");
console.log("You are currently in Mode 0 by default.\nUse 'm' to toggle between modes.\n");
console.log("------ Mode 0 Instruction Set ----------\n");
console.log("A : Draw Axes.\n");
console.log("C : Draw Models.\n");
console.log("a : Delete Axes.\n");
console.log("c : Delete Models.\n");
console.log("X : Delete Entire Scene.\n");

console.log("------ Mode 1 Instruction Set ----------\n");
console.log("D : Translate Models to endpoints of Triangle.\n");
console.log("E : Translate Models to midpoints of Triangle.\n");
console.log("F : Rotate Models.\n");
console.log("G : Scale Models.\n");
console.log("H : Select Models (o/f : Object/Face Selection).\n");
console.log("I : Rotate Camera about the Y-Axis.\n");

console.log("You can press Esc at anytime to quit the application.\n");

window.onload = () =>
{
	renderer.getCanvas().addEventListener('click', (event) =>
	{

		const rect = renderer.getCanvas().getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;		

		if(systemMode === 0)
		{
			

			if(shapeMode === "A")
			{
				if(primitives_axes.length === 0)
				{
					const colorX = new Float32Array([1.0, 0.0, 0.0]);
					const colorY = new Float32Array([0.0, 1.0, 0.0]);
					const colorZ = new Float32Array([0.0, 0.0, 1.0]);
					
					const meshX = new Mesh(gl, colorX, "X");
					const meshY = new Mesh(gl, colorY, "Y");
					const meshZ = new Mesh(gl, colorZ, "Z");	
					
					primitives.push(meshX);
					primitives.push(meshY);
					primitives.push(meshZ);

					primitives_axes.push(meshX);
					primitives_axes.push(meshY);
					primitives_axes.push(meshZ);
				}

			}

			else if(shapeMode === "C")
			{
				if(primitives_models.length === 0)
				{
					const colorW = new Float32Array([153.0 / 255.0, 1.0, 1.0]);
					const colorS = new Float32Array([154.0 / 255.0, 205.0 / 255.0, 50.0 / 255.0]);
					const colorA = new Float32Array([165.0 / 255.0, 42.0 / 255.0, 42.0/ 255.0]);

					const meshS = new Mesh(gl, colorS, "S");
					const meshW = new Mesh(gl, colorW, "W");
					const meshA = new Mesh(gl, colorA, "A");

					primitives.push(meshS);
					primitives.push(meshW);
					primitives.push(meshA);

					primitives_models.push(meshS);
					primitives_models.push(meshW);
					primitives_models.push(meshA);
				}
			}

			else if (shapeMode === "X")
			{

				primitives = [];
				primitives_axes = [];
				primitives_models = [];
			}

			else if (shapeMode === "a")
			{

				let temp_primitives = [];

				primitives.forEach(primitive =>
				{
					if (primitive.modelCode === "S" || primitive.modelCode === "W" || primitive.modelCode === "A")
					{
						temp_primitives.push(primitive);
					}
				});
				primitives = temp_primitives;
				primitives_axes = [];
			}

			else if (shapeMode === "c")
			{

				let temp_primitives = [];

				primitives.forEach(primitive =>
				{
					if (primitive.modelCode === "X" || primitive.modelCode === "Y" || primitive.modelCode === "Z")
					{
						temp_primitives.push(primitive);
					}
				});

				primitives = temp_primitives;
				primitives_models = [];
			}
		}

		else if (systemMode === 1)
		{

			if (shapeMode === "D")
			{
				primitives.forEach( primitive => 
				{
					let primitive_centres = primitive.getCentres(); 

					// console.log("Model Code : ");
					// console.log(primitive.modelCode);
					// console.log("Centres : ");
					// console.log(primitive_centres);
					
					if(primitive.modelCode === "S")
					{
						primitive.transform.addTranslation([1.5 , 0 , 0 ]);
						primitive.updateCentres();
					}

					else if (primitive.modelCode === "W") 
					{
						primitive.transform.addTranslation([-1.5, -1.5 , 0 ]);
						primitive.updateCentres();
					}

					else if (primitive.modelCode === "A") 
					{
						primitive.transform.addTranslation([0 , 1.5 , 0 ]);
						primitive.updateCentres();
					}

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

			else if (shapeMode === "H")
			{
				if (selectionMode === "o")
				{
					console.log("----------------------- Object Selection Mode -------------------------");
					
					var pixels = new Uint8Array(4);
					const format = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
					const type = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);
					
					const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
					const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;

					gl.readPixels(pixelX, pixelY, 1, 1, format, type, pixels);
					
					
					// console.log("Pixels : ", pixels);

					if (pixels[0] === 154)
					{
						primitives_models.forEach(model => 
						{
							if (model.modelCode === "S") 
							{
									model.color = new Float32Array([0.0 , 0.0, 0.0]);
							}

							else if (model.modelCode === "W") 
							{
								model.color = new Float32Array([153.0 / 255.0, 1.0, 1.0]);
							}

							else if (model.modelCode === "A") 
							{
								model.color = new Float32Array([165.0 / 255.0, 42.0 / 255.0, 42.0 / 255.0]);
							}
						});
					}

					else if (pixels[0] === 153) 
					{
						primitives_models.forEach(model => 
						{
							if (model.modelCode === "S") 
							{
									model.color = new Float32Array([154.0 / 255.0, 205.0 / 255.0, 50.0 / 255.0]);
							}

							else if (model.modelCode === "W") 
							{
								model.color = new Float32Array([0.0 , 0.0, 0.0]);
							}

							else if (model.modelCode === "A") 
							{
								model.color = new Float32Array([165.0 / 255.0, 42.0 / 255.0, 42.0 / 255.0]);
							}
						});
					}

					else if (pixels[0] === 165)
					{
						primitives_models.forEach(model => 
						{
							if (model.modelCode === "S") 
							{
									model.color = new Float32Array([154.0 / 255.0, 205.0 / 255.0, 50.0 / 255.0]);
							}

							else if (model.modelCode === "W") 
							{
								model.color = new Float32Array([153.0 / 255.0, 1.0, 1.0]);
							}

							else if (model.modelCode === "A") 
							{
								model.color = new Float32Array([0.0, 0.0, 0.0]);
							}
						});
					}

					else
					{
						primitives_models.forEach(model => 
						{
							if (model.modelCode === "S") 
							{
									model.color = new Float32Array([154.0 / 255.0, 205.0 / 255.0, 50.0 / 255.0]);
							}

							else if (model.modelCode === "W") 
							{
								model.color = new Float32Array([153.0 / 255.0, 1.0, 1.0]);
							}

							else if (model.modelCode === "A") 
							{
								model.color = new Float32Array([165.0 / 255.0, 42.0 / 255.0, 42.0 / 255.0]);
							}
						});
					}

					
				}

				else if (selectionMode === "f")
				{
					console.log("----------------------- Face Selection Mode -------------------------");
				}

				else
				{
					console.log("Please press 'o' / 'f' to enter Object / Face Mode.");
				}
			}

		}

	});

	renderer.getCanvas().addEventListener('mousedown', (event) =>
	{
		if(shapeMode === "I" && systemMode === 1)
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
		if (shapeMode === "I" && systemMode === 1)
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
		if (shapeMode === "I" && systemMode === 1)
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
	switch (event.key) {
     
      case "A":
        if (applicationRunning === 1 && systemMode === 0) {
		  console.log("You have opted to draw Axes.");
		  shapeMode = "A";
        }

        break;

      case "C":
        if (applicationRunning === 1 && systemMode === 0) {
		  console.log("You have opted to draw Models.");
		  shapeMode = "C";
        }

        break;

      case "D":
        if (applicationRunning === 1 && systemMode === 1) {
		  console.log("You have opted to translate Models to corners of a triangle.");
		  shapeMode = "D";
        }


        break;

      case "E":
        if (applicationRunning === 1 && systemMode === 1) {
		  console.log("You have opted to translate Models to midpoints of a triangle.");
		  shapeMode = "E";
        }


        break;

      case "F":
        if (applicationRunning === 1 && systemMode === 1) {
          console.log("You have opted to rotate Models.");
		  shapeMode = "F";
        }


        break;

      case "G":
        if (applicationRunning === 1 && systemMode === 1) {
          console.log("You have opted to scale Models.");
		  shapeMode = "G";
        }


        break;

      case "H":
        if (applicationRunning === 1 && systemMode === 1) {
		  console.log("You have opted to select Models.");
		  shapeMode = "H";
        }


        break;

      case "I":
        if (applicationRunning === 1 && systemMode === 1) {
          console.log("You have opted to Drag Camera.");
		  shapeMode = "I";
        }


        break;

      case "X":
        if (applicationRunning === 1 && systemMode === 0) {
		 console.log("You have opted to clear Screen.");
		 shapeMode = "X";
        }


        break;

      case "o":
        if (applicationRunning === 1 && shapeMode === "H") {
          console.log("You have chosen Object Mode.");
		  selectionMode = "o";
        }


        break;

      case "f":
        if (applicationRunning === 1 && shapeMode === "H") {
		  console.log("You have chosen Face Mode.");
		  selectionMode = "f";
        }


        break;

      case "m":
        systemMode = (systemMode + 1) % 2;

        if (applicationRunning === 1) {
          if (systemMode === 0) {
            console.log("Entering Scene Setting Mode : Mode ", systemMode);
          } else if (systemMode === 1) {
            console.log("Entering Model Manipulation Mode : Mode ", systemMode);
          }

		}
		break;

	  case "a":
		if (applicationRunning === 1 && systemMode === 0) {
			console.log("You have opted to delete Axes.");
			shapeMode = "a";
		}


		break;
		
	  case "c":
		if (applicationRunning === 1 && systemMode === 0) {
			console.log("You have opted to delete Models.");
			shapeMode = "c";
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

const uViewTransformMatrix = shader.uniform("uViewTransformMatrix");
const uProjectionTransformMatrix = shader.uniform("uProjectionTransformMatrix");

shader.setUniformMatrix4fv(uProjectionTransformMatrix, projectMatrix);


//Draw loop
function animate() 
{
	if(applicationRunning === 1)
	{
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		renderer.clear();
		
		primitives.forEach(primitive => 
		{
			if (shapeMode === "F" && systemMode === 1)
			{

				primitives_models.forEach( model =>
				{
					if(model.modelCode === "S")
					{
						model.transform.addRotation(angle, [0, 1, 0]);
					}

					else if (model.modelCode === "W") 
					{
						model.transform.addRotation(angle, [1, 0, 0]);
					}

					else if (model.modelCode === "A") 
					{
						model.transform.addRotation(angle, [0, 0, 1]);
					}

				});
			}

			shader.setUniformMatrix4fv(uViewTransformMatrix, viewMatrix);
			primitive.draw(shader);
		});
		window.requestAnimationFrame(animate);
	}

	else
	{
		renderer.clear();
	}
}

animate();
shader.delete();
