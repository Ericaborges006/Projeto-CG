var canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 100;
var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

var finalMatrixLocation;
var anguloDeRotacao = 0;
var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;

//variável que irá guardar a posição dos vértices
var vertexPosition;

//variável que irá guardar o conjunto de vértices que constituem cada triangulo´
var vertexIndex;

//Buffer que irá guardar todos os conjuntos de vértices na GPU
var gpuIndexBuffer = GL.createBuffer();

//Variável que guarda na memória da GPU a textura que será utilizada.
var boxTexture = GL.createTexture();

function PrepareCanvas() {

    GL.clearColor(0.65, 0.65, 0.65, 1.0);

    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    //permite o teste de profundidade
    GL.enable(GL.DEPTH_TEST);

    //permite visualizar apenas os triangunlos que tiverem as normais viradas para a câmara.
    //as normias são calculadas através da ordem pela qual os triangulos forem desenhados.
    //no sentido contrário ao ponteiro do relógio a normal vai estar virada para a câmara,
    //no caso contrário a normal vai estar a apontar na mesma direção que a câmara logo não será visualizado.
    GL.enable(GL.CULL_FACE);
    
    document.body.appendChild(canvas);

    canvas.insertAdjacentText('afterend', 'O canvas encontra-se acima deste texto!');

}

function PrepareShaders()
{
    GL.shaderSource(vertexShader, codigoVertexShader);

    GL.shaderSource(fragmentShader, codigoFragmentShader);
    
    GL.compileShader(vertexShader); 
    GL.compileShader(fragmentShader);

    if(!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)){
        console.error("ERRO :: a compilação do vertex shader lançou uma exceção!",
            GL.getShaderInfoLog(vertexShader));
    }

    if(!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)){
        console.error("ERRO :: a compilação do fragment shader lançou uma exceção!",
            GL.getShaderInfoLog(fragmentShader));
    }
}

function PrepareProgram(){

    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);

    GL.linkProgram(program);
    if(!GL.getProgramParameter(program, GL.LINK_STATUS)){
        console.error("ERRO :: o linkProgram lançou uma exceção!", GL.getProgramInfoLog(program));
    }

    GL.validateProgram(program);
    if(!GL.getProgramParameter(program, GL.VALIDATE_STATUS)){
        console.error("ERRO :: a validação do programa lançou uma exceção!", GL.getProgramInfoLog(program));
    }

    GL.useProgram(program);
}

function PrepareTriangleData(){
    
    //Em vez de termos 3 valores para as cores RGB vamos ter apenas
    //2 valores que são coordenadas UV
    vertexPosition = [
        //X,    Y,      Z,      U,      V
        
        //Frente (SOL)
        0,      0,      0,      0.5,        0.5,
        0,      1,      0,      0.5,        0, 
        1,      1,      0,      1,          0,
        1,      0,      0,      1,          0.5, 

        //Direita (DRAGAO)
        1,      0,      0,      0.5,        1,
        1,      1,      0,      0.5,        0.5,
        1,      1,      1,      1,          0.5, 
        1,      0,      1,      1,          1,

        //Trás (FLOR)
        1,      0,      1,      0,          1, 
        1,      1,      1,      0,          0.5,
        0,      1,      1,      0.5,        0.5, 
        0,      0,      1,      0.5,          1,

        //Esquerda (ARVORE)
        0,      0,      1,      0,          0.5,
        0,      1,      1,      0,          0,
        0,      1,      0,      0.5,        0, 
        0,      0,      0,      0.5,        0.5,

        //Cima
        0,      1,      0,      0,      0,
        0,      1,      1,      0,      1, 
        1,      1,      1,      1,      1,
        1,      1,      0,      1,      0, 

        //Baixo
        1,      0,      0,      0,      0, 
        1,      0,      1,      0,      1,
        0,      0,      1,      0,      1,
        0,      0,      0,      0,      0, 
    ];

    //Array que guarda qual os vertices do array anterior que constituem cada triangulo.
    //De relembrar que cada lado do cubo é constituido por 2 triangulo, por exemplo;
    //a primeira linha é "0, 1, 2" isto significa que um dos triangulos da face da frente é
    //formado pela 1ª, 2ª e 3ª linha (de relembrar que o indice do primeiro elemento)
    //num array é "0".
    vertexIndex=[
        //Frente
        0, 2, 1,
        0, 3, 2,

        //Direita
        4, 6, 5,
        4, 7, 6,

        //trás
        8, 10, 9,
        8, 11, 10,

        //Esquerda
        12, 14, 13,
        12, 15, 14,

        //Cima
        16, 18, 17,
        16, 19, 18,

        //Baixo
        20, 22, 21,
        20, 23, 22
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);

    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(vertexPosition), //não esquecer que agora é uma nova variável
        GL.STATIC_DRAW
    );

    //voltamos a fazer bind ao novo buffer que acabamos de criar dizendo que o buffer agora
    //é de ELEMENT_ARRAY_BUFFER.
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);
    //Passamos os dados relativos ao indices de cada triangulo
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,        //indica que os dados são do tipo ELEMENT_ARRAY_BUFFER
        new Uint16Array(vertexIndex),   //agora os valores são do tipo unsigned int 16
        GL.STATIC_DRAW
    );  //os valores são estáticos e não irão mudar ao longo do tempo

    //Agora que é necessário configurar os parâmetros da GPU.
    //Primeiro temos que fazer bind à textura.
    GL.bindTexture(GL.TEXTURE_2D, boxTexture);

    //Parametros necessários para a GPU saber como interpretar a rasterização
    //Faz clamp à borda no eixo do U
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    
    //Faz clamp à borda no eixo do V
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

    //As 2 linhas abaixo indicam como deve ser escalada a textura tanto
    //para diminui ça (TEXTURE_MIN_FILTER) como para aumenta la (TEXTURE_MAG_FILTER)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    //Passamos a imagem que está no documento "escondida" através do id da imagem
    GL.texImage2D(
        GL.TEXTURE_2D,      //tipo da textura
        0,                  //detalhe da imagem (0 é o valor por defeito)
        GL.RGBA,            //tipo de imagem
        GL.RGBA,            //tipo de textura que vai ser aplicada a imagem
        GL.UNSIGNED_BYTE,   //tipo de valores da textura
        document.getElementById('boxImage')     //imagem que deve ser passada para o sampler
    );
}

function SendDataToShaders(){

    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    //Agora em vez de irmos buscar a localização da variável "vertexColor" vamos buscar
    //a localização da variável "texCoords"
    var texCoordAttributeLocation = GL.getAttribLocation(program, "texCoords");  

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        //agora o conjunto apenas tem 5 valores (em vez de 6).
        5 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
        //mudar a variável de vertexColorAttributeLocation
        //para texCoordAttributeLocation
        texCoordAttributeLocation,
        //agora só enviamos um ocnjunto de 2 valores para a variável (em vez de 3)
        2,
        GL.FLOAT,
        false,
        //Agora o conjunto tem apenas 5 valores.
        5 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    //substituímos "vertexColorAttributeLocation" por "texCoordAttributeLocation"
    GL.enableVertexAttribArray(texCoordAttributeLocation);

    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
    visualizationMatrixLocation = GL.getUniformLocation(program, 'visualizationMatrix');
    projectionMatrixLocation = GL.getUniformLocation(program, 'projectionMatrix');
    viewportMatrixLocation = GL.getUniformLocation(program, 'viewportMatrix');

}

function loop()
{
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 100;
    GL.viewport(0,0,canvas.width,canvas.height);

    GL.useProgram(program);

    GL.clearColor(0.65, 0.65, 0.65, 1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

var finalMatrix = [
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,1]
];

//comentamos esta linha para o triângulo voltar ao tamanho nromal
//finalMatrix = math.multiply(CriarMatrizEscala(0.25,0.25,0.25), finalMatrix);

finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);

//atualizamos esta linha para o triangulo "voltar" para o centro e criamos
//uma translação o eixo do Z para que o triangulo fiqeu dentro do violume de visualização
//versão anterior: finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);
finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 2), finalMatrix);

finalMatrix = math.multiply(CriarMatrizTranslacao(0,0,1), finalMatrix);

var newarray = [];
for(i=0; i< finalMatrix.length; i++){
    newarray = newarray.concat(finalMatrix[i]);
}

var visualizationMatrix = MatrizDeVisualizacao([1,0,0],[0,1,0],[0,0,1],[0,0,0]);
var newVisualizationMatrix = [];
for(i=0; i< visualizationMatrix.length; i++){
    newVisualizationMatrix = newVisualizationMatrix.concat(visualizationMatrix[i]);
}

var projectionMatrix = MatrizPerspetiva(1, 4, 3, 0.1, 100);

var newprojectionMatrix = [];
for(i=0; i< projectionMatrix.length; i++){
    newprojectionMatrix = newprojectionMatrix.concat(projectionMatrix[i]);
}

var viewportMatrix = MatrizViewport(-1,1,-1,1);
var newViewportMatrix = [];
for(i=0; i< viewportMatrix.length; i++){
    newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
}

GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);

GL.uniformMatrix4fv(visualizationMatrixLocation, false, newVisualizationMatrix);
GL.uniformMatrix4fv(projectionMatrixLocation, false, newprojectionMatrix);
GL.uniformMatrix4fv(viewportMatrixLocation, false, newViewportMatrix);


//Agora em vez de chamarmos a função de drawArray, vamos chamar a função drawElements.
//Esta função permite nos utilizar vertexIndex para dizermos quais são os elementos que
//constituem os triângulos.
GL.drawElements(
    GL.TRIANGLES,   //queremos desenhar na mesma triangulos
    vertexIndex.length,     //o numero elementos que vão ser desenhados
    GL.UNSIGNED_SHORT,  //qual o tipo de elementos
    0       //qual o offset para o primeiro elemento a ser desenhado
);

anguloDeRotacao +=1;


requestAnimationFrame(loop);
}


function Start(){
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();

    loop();
}