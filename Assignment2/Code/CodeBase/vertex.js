const vertexShaderSrc = `      
        attribute vec3 aPosition;  
        uniform mat4 uWorldTransformMatrix;
        uniform mat4 uViewTransformMatrix;
        uniform mat4 uProjectionTransformMatrix;

        void main () {             
          gl_Position = uProjectionTransformMatrix * uViewTransformMatrix * uWorldTransformMatrix * vec4(aPosition, 1.0);
          gl_PointSize = 5.0;     
        }                          
	  `;

export default vertexShaderSrc;
