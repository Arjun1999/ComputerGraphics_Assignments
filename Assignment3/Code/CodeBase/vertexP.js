const vertexShaderSrcP = `

        attribute vec3 aPosition;
        attribute vec3 aVertexNormal;
        
        uniform mat4 uWorldTransformMatrix;
        uniform mat4 uViewTransformMatrix;
        uniform mat4 uProjectionTransformMatrix;
        uniform mat4 uNormalMatrix;
        
        varying vec3 normalInterp;
        varying vec3 vertPos;

        void main()
        {
          vec4 vertPos4 =  uViewTransformMatrix * uWorldTransformMatrix * vec4(aPosition, 1.0);
          vertPos = vec3(vertPos4) / vertPos4.w;
          normalInterp = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
          gl_Position = uProjectionTransformMatrix * uViewTransformMatrix * uWorldTransformMatrix * vec4(aPosition, 1.0);
        }


      
	  `;

export default vertexShaderSrcP;
