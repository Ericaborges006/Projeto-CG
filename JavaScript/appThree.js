document.addEventListener("DOMContentLoaded", Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
var renderer = new THREE.WebGLRenderer();

var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4/3, 0.1, 100);

renderer.setSize(window.innerWidth -15, window.innerHeight-80);

renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

var geometria = new THREE.BufferGeometry();
var vertices = new Float32Array([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
]);

const cores = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
]);

geometria.setAttribute('position', new THREE.BufferAttribute(vertices, 3) );
geometria.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cores), 3));

var material = new THREE.MeshBasicMaterial({vertexColors: true, side: THREE.DoubleSide});

var mesh = new THREE.Mesh(geometria, material);

//Comentamos esta linha de código para o triangulo voltar para o centro
//mesh.translateX(0.5);
//mesh.translateY(0.5);

//Comentamos esa linha para o triangulo voltar ao tamanho normal
//mesh.scale.set(0.25,0.25,0.25);

mesh.translateZ(-6.0);

var anguloDeRotacao = 0;

//Criação da geometria de um cubo, com os parametros de largura, altura e profundidade de 1 unidade
var geometriaCubo = new THREE.BoxGeometry(1,1,1);

//Criação do material básico que vai permitir configurar o aspeto das faces do cubo
//Neste caso, ativamos a propriedade vertexColors para que possamos definir as cores dos vértices
var materialCubo = new THREE.MeshBasicMaterial ({vertexColors: true});

//Primeiro, temos que carregar a textura para uma variável através do método TextureLoader()
var textura = new THREE.TextureLoader().load('./Images/boxImage.jpg');
var materialTextura = new THREE.MeshBasicMaterial({ map: textura });

//criação da variável que vai conter a informação do mapeamento uv
var uvAttribute = geometriaCubo.getAttribute('uv');

//Atribuição de posição uv a cada um dos vértices da geometria com recurso à função
//.setXY(indice do vértice, coordenada u, coordenada v)

/*************************************************************
*                          DESAFIO 2
************************************************************/
//SOL
uvAttribute.setXY(0,1,1);
uvAttribute.setXY(1,0.5,1);
uvAttribute.setXY(2,1,0.5);
uvAttribute.setXY(3,0.5,0.5);

//FLOR
uvAttribute.setXY(4,0.5,0.5);
uvAttribute.setXY(5,0,0.5);
uvAttribute.setXY(6,0.5,0);
uvAttribute.setXY(7,0,0);

uvAttribute.setXY(8,1,1);
uvAttribute.setXY(9,0,1);
uvAttribute.setXY(10,1,0);
uvAttribute.setXY(11,0,0);

uvAttribute.setXY(12,1,1);
uvAttribute.setXY(13,0,1);
uvAttribute.setXY(14,1,0);
uvAttribute.setXY(15,0,0);

//ARVORE
uvAttribute.setXY(16,0.5,1);
uvAttribute.setXY(17,0,1);
uvAttribute.setXY(18,0.5,0.5);
uvAttribute.setXY(19,0,0.5);

//DRAGAO
uvAttribute.setXY(20,1,0.5);
uvAttribute.setXY(21,0.5,0.5);
uvAttribute.setXY(22,1,0);
uvAttribute.setXY(23,0.5,0);

//como definimos novos valores para o mapeamento uv, é necesário ativar a sua atualização
geometriaCubo.uvsNeedUpdate = true;

//definição das cores dos vértices do cubo
const vertexColorsCubo = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0,

    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,

    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0,

    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,

    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0,
]);

//associar ao array com as cores dos vértices à propriedade de cor da geometria
geometriaCubo.setAttribute('color', new THREE.Float32BufferAttribute(vertexColorsCubo, 3));

//apõs criar a geometria e o material, criamos a mesh com os dados da geometria e do material.
meshCubo = new THREE.Mesh(geometriaCubo, materialTextura);

//criamos uma tranlação no eixo do Z para que o triangulo fique dentro do volume de visualização
meshCubo.translateZ(-6.0);

function Start(){
    //comentamos esta linha para o truangulo não ser adicionado
    //cena.add(mesh);

    //adicionamos esta linha para adicionar o cubo a cena
    cena.add(meshCubo);

    renderer.render(cena, camaraPerspetiva);

    //função para chamar a nossa função de loop
    requestAnimationFrame(loop);
}

function loop()
{
    //comentamos a linha que faz o triangulo rodar pois já não precisamos dela
    //mesh.rotateY(Math.PI/180 * 1);

    //tal como fizemos inicialmente com o triangulo, vamos colocar o cubo a rodar no eixo do Y
    meshCubo.rotateY(Math.PI/180 * 1);

    //função chamada para gerarmos um novo frame
    renderer.render(cena, camaraPerspetiva);

    //função chamada para executar de novo a funão loop de forma a gerar o frame seguinte
    requestAnimationFrame(loop);
}
