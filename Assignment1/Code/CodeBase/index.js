import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Triangle from './triangle.js';
import Rectangle from './rectangle.js';
import Circle from './circle.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

const renderer = new Renderer();
const gl = renderer.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();


// Mode Initializations
let systemMode = 0;
let shapeMode = "r";
let currentSelection = -1;
let applicationRunning = 1;

// Instance Translation Initializations
let translationx = vec3.fromValues(0.15, 0, 0);
let translationnegx = vec3.fromValues(-0.15, 0, 0);
let translationy = vec3.fromValues(0, 0.15, 0);
let translationnegy = vec3.fromValues(0, -0.15, 0);

// Instance  Scaling Initializations
let scalingfactor = 0.1;
let scaleup = vec3.fromValues(1 + scalingfactor, 1 + scalingfactor, 1);
let scaledown = vec3.fromValues(1 - scalingfactor, 1 - scalingfactor, 1);

// Scene Rotation Initializations
let rotationangle = 0.01
let rotationaxis = vec3.fromValues(0, 0, 1)
let totalrotation = 0;
let mode2visited = 0;

// Scene Centroid Calculation Initializations
let MinX = 0;
let MaxX = 0;
let MinY = 0;
let MaxY = 0;

let primitives = [];

// console.log("Entering Drawing Mode : Mode ", systemMode);
console.log("Welcome to the AbstractArtistApplication\n\nYou are currently in the default drawing mode\nPress 'm' to toggle between modes\n");
console.log("The default drawing shapes are Rectangles \nPress 's' or 'c' to opt for Squares or Circles respectively \n");
console.log("Press Esc key anytime to quit the application.");

window.onload = () =>
{
	renderer.getCanvas().addEventListener('click', (event) =>
	{
		let mouseX = event.clientX;
		let mouseY = event.clientY;

		const clipCoordinates = renderer.mouseToClipCoord(mouseX,mouseY);

		if(systemMode === 0)
		{
			

			if(shapeMode === "r")
			{
				
				const color = new Float32Array([1.0, 0.0, 0.0]);
				primitives.push(new Rectangle(gl, clipCoordinates[0], clipCoordinates[1], 0.25, 0.5, color));
			}

			else if(shapeMode === "s")
			{
				const color = new Float32Array([1.0, 0.0, 1.0]);
				primitives.push(new Rectangle(gl, clipCoordinates[0], clipCoordinates[1], 0.25, 0.25, color));

			}

			else if(shapeMode === "c")
			{
				const color = new Float32Array([0.0, 0.0, 1.0]);
				primitives.push(new Circle(gl, clipCoordinates[0], clipCoordinates[1], 0.125, 50, color));

			}

		}

		else if (systemMode === 1)
		{
			let minDistance = Math.sqrt(Math.pow((clipCoordinates[0] - primitives[0].getCentroid()[0]), 2) + Math.pow((clipCoordinates[1] - primitives[0].getCentroid()[1]), 2));
			currentSelection = 0;
		
			primitives.forEach((primitive, index) =>
				{
					let cx = primitive.getCentroid()[0];
					let cy = primitive.getCentroid()[1];



					if (Math.sqrt(Math.pow((clipCoordinates[0] - cx), 2) + Math.pow((clipCoordinates[1] - cy), 2)) < minDistance)
					{
						currentSelection = index;
						minDistance = Math.sqrt(Math.pow((clipCoordinates[0] - cx), 2) + Math.pow((clipCoordinates[1] - cy), 2));
					}	
				});
	
			primitives.forEach((primitive, index) =>
				{
					if(index === currentSelection)
					{
						primitive.color = vec3.fromValues(0, 0, 0);
					}

					else
					{
						if (primitive.getShape() === "S") 
						{
							primitive.color = vec3.fromValues(1, 0, 1);
						} 
						
						else if (primitive.getShape() === "R") 
						{
							primitive.color = vec3.fromValues(1, 0, 0);
						}

						if (primitive.getShape() === "C") 
						{
							primitive.color = vec3.fromValues(0, 0, 1);
						}
					}
				});

		}

	});

	window.addEventListener("keydown", function(event)
	{
		switch (event.key)
		{
			case "ArrowRight":
				if(systemMode === 1)
				{
					primitives.forEach( primitive =>
						{
							primitive.transform.setWTranslate1(vec3.fromValues(0, 0, 0));
							primitive.transform.setWTranslate2(vec3.fromValues(0, 0, 0));
							primitive.transform.setWRotate(vec3.fromValues(0, 0, 1), 0);
							primitive.transform.updateWVMatrix();

						});

					primitives[currentSelection].transform.setTranslate(translationx);
					primitives[currentSelection].transform.setScale(vec3.fromValues(1, 1, 1));
					
					primitives[currentSelection].transform.updateMVPMatrix();
					primitives[currentSelection].updateCentroid();
				}
				
				else if(systemMode === 2)
				{
					mode2visited = 1;	
					
					let InitMins = primitives[0].getMins()
					MinX = InitMins[0];
					MaxX = InitMins[1];
					MinY = InitMins[2];
					MaxY = InitMins[3];
					

					primitives.forEach(primitive =>
						{
							if(primitive.getMins()[0] < MinX)
							{
								MinX = primitive.getMins()[0];
							}

							if (primitive.getMins()[2] < MinY)
							{
								MinY = primitive.getMins()[2];
							}

							if (primitive.getMins()[1] > MaxX)
							{
								MaxX = primitive.getMins()[1];
							}

							if (primitive.getMins()[3] > MaxY)
							{
								MaxY = primitive.getMins()[3];
							}
						});

					// console.log("AntiClockwise");
					// console.log([MinX + ((MaxX - MinX) / 2), MinY + ((MaxY - MinY) / 2)]);
					
					primitives.forEach( primitive =>
						{
							primitive.transform.setWTranslate1(vec3.fromValues(MinX + ((MaxX - MinX) / 2), MinY + ((MaxY - MinY) / 2), 0));
							primitive.transform.setWTranslate2(vec3.fromValues(-(MinX + ((MaxX - MinX) / 2)), -(MinY + ((MaxY - MinY) / 2)), 0));
							primitive.transform.setWRotate(rotationaxis, rotationangle);
							primitive.transform.updateWVMatrix();

						});

					totalrotation += rotationangle;
				}
				break;

			case "ArrowLeft":
				if(systemMode === 1)
				{
					primitives.forEach( primitive =>
						{
							primitive.transform.setWTranslate1(vec3.fromValues(0, 0, 0));
							primitive.transform.setWTranslate2(vec3.fromValues(0, 0, 0));
							primitive.transform.setWRotate(vec3.fromValues(0, 0, 1), 0);
							primitive.transform.updateWVMatrix();

						});

					primitives[currentSelection].transform.setTranslate(translationnegx);
					primitives[currentSelection].transform.setScale(vec3.fromValues(1, 1, 1));
					
					primitives[currentSelection].transform.updateMVPMatrix();
					primitives[currentSelection].updateCentroid();
					
				}

				else if(systemMode === 2)
				{
					mode2visited = 1;

					let InitMins = primitives[0].getMins()
					MinX = InitMins[0];
					MaxX = InitMins[1];
					MinY = InitMins[2];
					MaxY = InitMins[3];
					

					primitives.forEach(primitive =>
						{
							if(primitive.getMins()[0] < MinX)
							{
								MinX = primitive.getMins()[0];
							}

							if (primitive.getMins()[2] < MinY)
							{
								MinY = primitive.getMins()[2];
							}

							if (primitive.getMins()[1] > MaxX)
							{
								MaxX = primitive.getMins()[1];
							}

							if (primitive.getMins()[3] > MaxY)
							{
								MaxY = primitive.getMins()[3];
							}
						});

					// console.log("Clockwise");
					// console.log([MinX + ((MaxX - MinX) / 2), MinY + ((MaxY - MinY) / 2)]);
					
					primitives.forEach( primitive =>
						{
							

							primitive.transform.setWTranslate1(vec3.fromValues(MinX + ((MaxX - MinX) / 2), MinY + ((MaxY - MinY) / 2), 0));
							primitive.transform.setWTranslate2(vec3.fromValues(-(MinX + ((MaxX - MinX) / 2)), -(MinY + ((MaxY - MinY) / 2)), 0));

							primitive.transform.setWRotate(rotationaxis, -1 * rotationangle);
							primitive.transform.updateWVMatrix();

						});

					totalrotation -= rotationangle;
				}
				break;

			case "ArrowUp":
				if(systemMode === 1)
				{
					primitives.forEach( primitive =>
						{
							primitive.transform.setWTranslate1(vec3.fromValues(0, 0, 0));
							primitive.transform.setWTranslate2(vec3.fromValues(0, 0, 0));
							primitive.transform.setWRotate(vec3.fromValues(0, 0, 1), 0);
							primitive.transform.updateWVMatrix();

						});

					primitives[currentSelection].transform.setTranslate(translationy);
					primitives[currentSelection].transform.setScale(vec3.fromValues(1, 1, 1));
					
					primitives[currentSelection].transform.updateMVPMatrix();
					primitives[currentSelection].updateCentroid();
		
				}
				break;

			case "ArrowDown":
				if(systemMode === 1)
				{
					primitives.forEach( primitive =>
						{
							primitive.transform.setWTranslate1(vec3.fromValues(0, 0, 0));
							primitive.transform.setWTranslate2(vec3.fromValues(0, 0, 0));
							primitive.transform.setWRotate(vec3.fromValues(0, 0, 1), 0);
							primitive.transform.updateWVMatrix();

						});

					primitives[currentSelection].transform.setTranslate(translationnegy);
					primitives[currentSelection].transform.setScale(vec3.fromValues(1, 1, 1));
					
					primitives[currentSelection].transform.updateMVPMatrix();
					primitives[currentSelection].updateCentroid();
				
				}
				break;

			case "+":
				if(systemMode === 1)
				{
					primitives.forEach(primitive => {
						primitive.transform.setWTranslate1(vec3.fromValues(0, 0, 0));
						primitive.transform.setWTranslate2(vec3.fromValues(0, 0, 0));
						primitive.transform.setWRotate(vec3.fromValues(0, 0, 1), 0);
						primitive.transform.updateWVMatrix();

					});

					
					primitives[currentSelection].transform.setScale(scaleup);
					primitives[currentSelection].transform.setTranslate(vec3.fromValues(0, 0, 0));

					
					primitives[currentSelection].transform.updateMVPMatrix();
					
				}
				break;
			
			case "-":
				if(systemMode === 1)
				{
					primitives.forEach( primitive =>
					{
						primitive.transform.setWTranslate1(vec3.fromValues(0, 0, 0));
						primitive.transform.setWTranslate2(vec3.fromValues(0, 0, 0));
						primitive.transform.setWRotate(vec3.fromValues(0, 0, 1), 0);
						primitive.transform.updateWVMatrix();

					});
					
					primitives[currentSelection].transform.setScale(scaledown);
					primitives[currentSelection].transform.setTranslate(vec3.fromValues(0, 0, 0));

					
					primitives[currentSelection].transform.updateMVPMatrix();
					
				}
				break;

			case "x":
				if(systemMode === 1)
				{
					let temp_primitives = [];
					primitives.forEach((primitive,index) => 
					{
						if(index !== currentSelection)
						{
							temp_primitives.push(primitive);
						}
					});
					currentSelection = -1;
					primitives = temp_primitives;
					
				}
				break;


			case "r":
				if(applicationRunning === 1)
				{
					console.log("You have opted to draw Rectangles");
				}
				shapeMode = "r";

				break;
			case "s":
				if(applicationRunning === 1)
				{
					console.log("You have opted to draw Squares");
				}
				shapeMode = "s";

				break;
			case "c":
				if(applicationRunning === 1)
				{
					console.log("You have opted to draw Circles");
				}
				shapeMode = "c";

				break;
			case "m":
				systemMode = (systemMode + 1) % 3;
				
				if (applicationRunning === 1)
				{
					if(systemMode === 0)
					{
						console.log("Entering Drawing Mode : Mode ", systemMode);
					}

					else if(systemMode === 1)
					{
						console.log("Entering InstanceTransformation Mode : Mode ", systemMode);
					}

					else if(systemMode === 2)
					{
						console.log("Entering SceneTransformation Mode : Mode ", systemMode);
					}
				}

				if(systemMode === 2)
				{
					if(currentSelection !== -1)
					{
						if(primitives[currentSelection].getShape() === "R")
						{
							primitives[currentSelection].color = vec3.fromValues(1, 0, 0);
						}

						else if (primitives[currentSelection].getShape() === "S")
						{
							primitives[currentSelection].color = vec3.fromValues(1, 0, 1);
						}

						else if (primitives[currentSelection].getShape() === "C")
						{
							primitives[currentSelection].color = vec3.fromValues(0, 0, 1);
						}
					}
				}

				if(systemMode === 0 && mode2visited === 1)
				{
					
					primitives.forEach( primitive =>
					{
						// console.log("Returning");
						// console.log([MinX + ((MaxX - MinX) / 2), MinY + ((MaxY - MinY) / 2)]);

						primitive.transform.setWTranslate1(vec3.fromValues(MinX + ((MaxX - MinX) / 2), MinY + ((MaxY - MinY) / 2), 0));
						primitive.transform.setWTranslate2(vec3.fromValues(-(MinX + ((MaxX - MinX) / 2)), -(MinY + ((MaxY - MinY) / 2)), 0));						
						primitive.transform.setWRotate(vec3.fromValues(0, 0, 1), -1 * totalrotation);
						primitive.transform.updateWVMatrix();

				});
				totalrotation = 0;
				mode2visited = 0;
				}
				break;

			case 'Escape':
				applicationRunning = 0;
				console.log("You have opted to close the application \nThank you for your time\n");
				break;
				
		}
	},
		true
	);
};

function animate()
{
	
	if(applicationRunning === 1)
	{
		renderer.clear();
		primitives.forEach(primitive => 
			{
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