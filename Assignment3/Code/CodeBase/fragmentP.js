const fragmentShaderSrcP = `

    precision mediump float;
    
    struct lightProperties 
    {    
          vec3 position;
          vec4 ambient;
          vec4 diffuse;
          vec4 specular;
          float enabled;
    };  

    varying vec3 normalInterp;  
    varying vec3 vertPos;       

    uniform float Ka;
    uniform float Kd;
    uniform float Ks;
    uniform float shininessVal;

    uniform float a;
    uniform float b;
    uniform float c;

    uniform lightProperties light[3];

    vec4 concatenateColor(float Ka, float Kd, float Ks, vec4 ambientColor, vec4 diffuseColor, vec4 specularColor, float lambertian, float specular, float a, float b, float c, vec3 L)
    {
      return vec4(vec3(Ka * ambientColor + ((Kd * lambertian * diffuseColor) + (Ks * specular * specularColor)) / (a + (b * length(L)) + (c * length(L) * length(L)))), 1.0);
    }

    void main() 
    {

      vec4 color = vec4(0.0);
      for(int i = 0; i < 3; i++)
      {
        if(light[i].enabled == 1.0)
        {

          vec3 N = normalize(normalInterp);
          vec3 L = normalize(light[i].position - vertPos);

          float lambertian = max(dot(N, L), 0.0);
          float specular = 0.0;

          if(lambertian > 0.0)
          {
              vec3 R = reflect(-L, N);
              vec3 V = normalize(-vertPos);

              float specAngle = max(dot(R, V), 0.0);
              specular = pow(specAngle, shininessVal);

          }

          color += concatenateColor(Ka, Kd, Ks, light[i].ambient, light[i].diffuse, light[i].specular, lambertian, specular, a, b, c, L);
        }
      }
      
      gl_FragColor = color;
    }

	  `;

export default fragmentShaderSrcP;
