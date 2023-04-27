var codigoVertexShader = [
    'precision mediump float;' 
    ,
    'attribute vec3 vertexPosition;',
    //Uma vez que agora vamos receber coordenadas UV já não vamos precisar da linha
    //'attribute vec3 vertexColor;', e vamos substituí la pela linha abaixo
    'attribute vec2 texCoords;',
    ,
    //Pela mesma explicação da variável acia, agora já não vamos precisar da linha
    //'varying vec3 fragColor;', e vamos substituí la pela linha abaixo
    'varying vec2 fragTexCoords;',
    ,
    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;',
    'uniform mat4 projectionMatrix;',
    'uniform mat4 viewportMatrix;', 
    ,
    'void main(){',
    //Uma vez que agora já não estamos a utilizar cores, temos que adaptar a linha abaixo
    //para qye o fragment shader receba as coordenadas UV.
    '   fragTexCoords = texCoords;',
    '   gl_Position = vec4(vertexPosition, 1.0) * transformationMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;',
    '}'
].join('\n');

var codigoFragmentShader = [
    'precision mediump float;'
    ,
    //Uma vez que agora vamos receber coordenadas UV já não vamos precisar da linha
    //'varying vec3 fragColor;', e vamos substituí la pela linha abaixo
    'varying vec2 fragTexCoords;',
    ,
    //Vamos adicionar uma variável que guarde a texture que vai ser utilizada para
    //aplicar ao cubo
    'uniform sampler2D sampler;',
    ,
    'void main(){',
    //Uma vez que temos as coordenas UV temos que utilizar a função abaixo para ir buscar
    //a cor de cada pixel à textura fornecida.
    '   gl_FragColor = texture2D(sampler, fragTexCoords);',
    '}'
].join('\n');