//Importação da biblioteca Three.js baseada no importmap
import * as THREE from 'three';

//importação da biblioteca que nos permite importar objetos 3D em formato FBX baseada no importmap
import { FBXLoader } from 'FBXLoader';

//Importação da biblioteca que nos permite explorar a nossa cena através do importmap
import { PointerLockControls } from 'PointerLockControls';


document.addEventListener("DOMContentLoaded", Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
var renderer = new THREE.WebGLRenderer();

var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100);

renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

var geometriaCubo = new THREE.BoxGeometry(1, 1, 1);

var textura = new THREE.TextureLoader().load('./Images/boxImage.jpg');
var materialTextura = new THREE.MeshStandardMaterial({ map: textura });

var meshCubo = new THREE.Mesh(geometriaCubo, materialTextura);
meshCubo.translateZ(-6.0);


/********************************************************
Código base para importação de objetos 3D em formato FBX
*********************************************************/

//variável que guardará o objeto importado
var objetoImportado;

//variável que irá guardar o controlador de aimações do objeto importado
var mixerAnimacao;

//variável que é responsável por guardar o tempo da aplicação
var relogio = new THREE.Clock();

//variável com o objeto responsável por importar ficheiros FBX
var importer = new FBXLoader();

importer.load('./Objetos/Samba Dancing.fbx', function (object) {

    //o mixerAnimacao é inicializado tendo em conta o objeto importado
    mixerAnimacao = new THREE.AnimationMixer(object);

    //object.animations é um array com todas as animações que o objeto trás quando é importado
    //o que fazemos é criar uma ação de animação tendo em conta a animação que é pretendida
    //de seguida é inicializada a reporodução da animação
    var action = mixerAnimacao.clipAction(object.animations[0]);
    action.play();

    //object.traverse é uma função que percorre todos os filhos desse mesmo objeto.
    //o primeiro e único parâmetro da função é um anova função que deve ser chamada para cada filho.
    //neste caso, o que nós fazemos é ver se o filho tem uma mesh e, no caso de ter,
    //é indicado a esse objeto que deve permitir e projetar e receber sombras, respetivamente.
    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
});

//adiciona o objeto importado à cena
cena.add(object);	

//quando o objeto é importado, esta tem uma escala de 1 nos 3 eixos (XYZ). Uma vez que
//este é demasiado grande, mudamos a escala deste projeto para ter 0.01 em todos os eixos.
object.scale.x = 0.01;
object.scale.y = 0.01;
object.scale.z = 0.01;

//Mudamos a posição do objeto importado para que este não fique na mesma posição que o cubo.
object.position.x = 1.5;
object.position.y = -0.5;
object.position.z = -6.0;

//Guardamos o objeto importado na variável objetoImportado.
objetoImportado = object;
});


const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);

controls.addEventListener('lock', function() {
    //Possibilidade de programar comportamentos (ThreeJS ou mesmo HTML) quando
    //o POinterLockControls é ativado.
});
controls.addEventListener('unlock', function() {
    //Possibilidade de programar comportamentos (ThreeJS ou mesmo HTML) quando
    //o POinterLockControls é ativado.
});

//Ativação do PointerLockControls através do clique na cena 
//para desativar o PointerLockControls, basta pressionar na tecla Enter
document.addEventListener(
        'click', 
        function() {
            controls.lock();
        }, 
        false
    );

//Adiciona o listener que permite detetar quando uma tecla é pressionada
document.addEventListener("keydown", onDocumentKeyDown, false);

//função que permite processar o evento de premir teclas e definir o seu respetivo comportamento
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    //comportamento para a tecla W
    if (keyCode == 87) {
        controls.moveForward(0.25);
    }
    //Comportamento para a tecla S
    else if (keyCode == 83) {
        controls.moveForward(-0.25);
    }
    //Comportamento para a tecla A
    else if (keyCode == 65) {
        controls.moveRight(-0.25);
    }
    //Comportamento para a tecla D
    else if (keyCode == 68) {
        controls.moveRight(0.25);
    }
    //Comportamento para a tecla Barra de Espaço
    else if (keyCode == 32) {
        //verificar se o cubo está presente na cena.
        //caso esteja, removemos. Caso contrário, adicionamos.
        if(meshCubo.parent == cena){
            cena.remove(meshCubo);
        }else{
            cena.add(meshCubo);
        }
    }
};

/********************************************************
 *                          SKYBOX                      *    
 * ******************************************************/

//Carregamento de texturas para as variáveis
/*var texture_dir = new THREE.TextureLoader().load('./Skybox/posx.jpg');      //imagem da direita
var texture_esq = new THREE.TextureLoader().load('./Skybox/negx.jpg');      //imagem da esquerda
var texture_up = new THREE.TextureLoader().load('./Skybox/posy.jpg');      //imagem de cima
var texture_dn = new THREE.TextureLoader().load('./Skybox/negy.jpg');      //imagem de baixo
var texture_bk = new THREE.TextureLoader().load('./Skybox/posz.jpg');      //imagem de trás
var texture_ft = new THREE.TextureLoader().load('./Skybox/negz.jpg');     //imagem da frente

//array que vai armazenar as texturas
var materialArray = [];

//Associar a texturas carrergadas ao array
materialArray.push(new THREE.MeshBasicMaterial({map: texture_dir}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_esq}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));

//ciclo para fazer com que as texturas do array sejam aplicadas na parte inferior do cubo
for (var i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;
*/


//Em vez de criar 6 variáveis para guardar as texturas, podemos criar uma função reutilizável qur dá loop pelas imagens.
//A função createPathStrings() recebe como parâmetro o file image name, filename

function createPathStrings(filename)
{
    var path = "./Skybox/";
    var baseFileName = path + filename;
    var format = ".tga";
    var sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    var pathStrings = sides.map(function(side) {
        return baseFileName + "_" + side + format;} );
    
    return pathStrings;
}//isto deve criar um array de strings com o path de cada imagem do género ['./SkyBox/stormydays_ft.tga', './SkyBox/stormydays_bk.tga', ...]

//agora temos de dar load de cada textura usando o TextureLoader.load().
//Para isso, vamos usar a função map() que vai percorrer o array de strings e carregar cada uma das texturas.

function createMaterialArray(filename){
    var skyboxImagepaths = createPathStrings(filename);
    var materialArray = skyboxImagepaths.map(function(image){
        let texture = new THREE.TextureLoader().load(image);

        return new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
    });

    return materialArray;
}

//Criação do array de materiais que vai conter as texturas
var materialArray = createMaterialArray('stormydays');

//Criação da geometria do skybox
var skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);

//Criação da mesh que vai conter a geometria e as texturas
var skybox = new THREE.Mesh(skyboxGeo, materialArray);

//adicionar o skybox à cena
cena.add(skybox);


function Start() {

    cena.add(meshCubo);

    //Criação de um foco de luz com a cor branca (#ffffff) e intensidade 1 (intensidade normal)
    var focoLuz = new THREE.SpotLight(0xffffff, 1);

    //Mudar a poisção da luz para ficar 5 unidades a cima de onde a câmara se encontra.~
    focoLuz.position.y = 5;
    focoLuz.position.z = 10;

    //Dizemos a light pata ficar a apontar para a poisção do cubo.
    focoLuz.lookAt(meshCubo.position);

    //Adicionamos a luz à cena.
    cena.add(focoLuz);


    renderer.render(cena, camaraPerspetiva);
    
    requestAnimationFrame(loop);
}

function loop() {

    meshCubo.rotateY(Math.PI / 180 * 1);

    //Necessário atualizar o mixer de animação tendo em conta o tempo desde o ultimo update.
    //relogio.getDelta() indica quanto tempo passou desde o último frame renderizado.
    if(mixerAnimacao){
        mixerAnimacao.update(relogio.getDelta());
    }

    renderer.render(cena, camaraPerspetiva);

    requestAnimationFrame(loop);
}

