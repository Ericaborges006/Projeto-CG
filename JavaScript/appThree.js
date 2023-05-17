//Importação da biblioteca Three.js baseada no importmap
import * as THREE from 'three';

//importação da biblioteca que nos permite importar objetos 3D em formato FBX baseada no importmap
import { FBXLoader } from 'FBXLoader';

//Importação da biblioteca que nos permite explorar a nossa cena através do importmap
import{PointerLockControls} from 'PointerLockControls';

import { OBJLoader } from 'OBJLoader';


document.addEventListener("DOMContentLoaded", Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
var renderer = new THREE.WebGLRenderer();

let isPerspectiveCameraActive = true;

var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100);
camaraPerspetiva.position.set(0, 1.6, 0); // Adicionar height à câmara

camara.updateProjectionMatrix();

renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

var geometriaCubo = new THREE.BoxGeometry(1, 1, 1);

var textura = new THREE.TextureLoader().load('./Images/boxImage.jpg');
var materialTextura = new THREE.MeshStandardMaterial({ map: textura });

var meshCubo = new THREE.Mesh(geometriaCubo, materialTextura);
meshCubo.translateZ(-6.0);

/********************************************************
                    GRID HELPER
*********************************************************/

const size = 100;
const divisions = 100;

const gridHelper = new THREE.GridHelper( size, divisions );
cena.add( gridHelper );


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

//var importerOBJ = new OBJLoader();
var importerOBJ = new OBJLoader();

// Podio teste
importer.load('./Objetos/Bed.fbx', function (object) {
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;
  
    object.position.x = -12.8;
    object.position.y = -0.5;
    object.position.z = -10.3;
    
    objectImportado = object; 

});

//var importer = new THREE.OBJLoader();
importer.load('./Objetos/Podium.obj', function (object) {

    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;

    object.position.x = 0;
    object.position.y = 2;
    object.position.z = -6.0;
    
    objectImportado = object; 

});

importer.load('./Objetos/SimpleHouse.fbx', function (object) {

    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    cena.add(object);	

    object.scale.x = 0.002;
    object.scale.y = 0.002;
    object.scale.z = 0.002;

    object.position.x = 0;
    object.position.y = -0.5;
    object.position.z = 1;
   
    objetoImportado = object;
});

//função para mudar entre as 2 câmaras
function mudarCamara() {
    isPerspectiveCameraActive = !isPerspectiveCameraActive;
  
    // Set the active camera
    if (isPerspectiveCameraActive) {
      camara.position.copy(camaraPerspetiva.position);
      camara.rotation.copy(camaraPerspetiva.rotation);
      renderer.render(cena, camaraPerspetiva);
    } else {
      camaraPerspetiva.position.copy(camara.position);
      camaraPerspetiva.rotation.copy(camara.rotation);
      renderer.render(cena, camara);
    }
}

//função para ligar e desligar as luzes
function toggleLight(light) {
    light.visible = !light.visible;
}

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
    if (keyCode == 83) {
        controls.moveForward(-0.25);
    }
    //Comportamento para a tecla A
    if (keyCode == 65) {
        controls.moveRight(-0.25);
    }
    //Comportamento para a tecla D
    if (keyCode == 68) {
        controls.moveRight(0.25);
    }
    //comportamento para a tecla C, para mudar entre as 2 câmaras
    if (keyCode == 67) {   
        mudarCamara();
    }
    //Comportamento para a tecla Barra de Espaço
    if (keyCode == 32) {
        //verificar se o cubo está presente na cena.
        //caso esteja, removemos. Caso contrário, adicionamos.
        if(meshCubo.parent == cena){
            cena.remove(meshCubo);
        }else{
            cena.add(meshCubo);
        }
    }
    //Lógica para ligar/desligar as luzes
    if (keyCode == 49) {    //press 1
        toggleLight(luzAmbiente);
    }
    else if(keyCode == 50){ //press 2
        toggleLight(luzDirecional);
    }
    else if(keyCode == 51){ //press 3
        toggleLight(luzPontual);
    }
};

/********************************************************
 *                     Frigorifico                      *    
 * ******************************************************/
var meshFridge;
var doorMesh;
var doorAnimation;
var door2Mesh;



function triggerdoor(mesh) {

  if (mesh.userData.isopen == 0) {
    doorAnimation = new TWEEN.Tween(mesh.rotation)
    .to({ y: Math.PI / -2 }, 1000) // Rotate the door to 90 degrees (open position) in 1 second
    .start()
    .onComplete(function () {
      mesh.userData.isopen = 1;
    });
  }else{
    doorAnimation = new TWEEN.Tween(mesh.rotation)
    .to({ y: 0 }, 1000) // Rotate the door to 0 degrees (closed position) in 1 second
    .start()
    .onComplete(function () {
      mesh.userData.isopen = 0;
    });
  }
}

function create_frigo(x,y,z){
// create the main fridge mesh
var geometriaFridge = new THREE.BoxGeometry(0.1, 3, 1.2);
var texture = new THREE.TextureLoader().load('./Images/fridge_texture.jpg');
var materialFridge = new THREE.MeshBasicMaterial({ map: texture });
meshFridge = new THREE.Mesh(geometriaFridge, materialFridge);

// create the fridge door mesh
var doorGeometry = new THREE.BoxGeometry(0.1, 2, 1.2);  
doorGeometry.translate( 0, 0, -0.55 );
var texture = new THREE.TextureLoader().load('/Images/Fridge_texture.jpg');
var doorMaterial = new THREE.MeshBasicMaterial({ map:texture });
doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
// position the door mesh relative to the fridge mesh
doorMesh.position.x = 1.2;
doorMesh.position.y = -0.525;
doorMesh.position.z = 0.55;
doorMesh.userData.isopen = 0;
meshFridge.add(doorMesh);

//create door handle
var handleGeometry=new THREE.BoxGeometry(0.1, 0.5, 0.1);
var handleMaterial = new THREE.MeshBasicMaterial({ map: texture});
var handleMesh= new THREE.Mesh(handleGeometry, handleMaterial);

handleMesh.position.z=-1;
handleMesh.position.x=0.1;

doorMesh.add(handleMesh);



// create the 2nd fridge door mesh
var door2Geometry = new THREE.BoxGeometry(0.1, 1, 1.2);
door2Geometry.translate( 0, 0, -0.55 );
var texture = new THREE.TextureLoader().load('/Images/Fridge_texture.jpg');
var doorMaterial = new THREE.MeshBasicMaterial({ map:texture });
door2Mesh = new THREE.Mesh(door2Geometry, doorMaterial);
// position the 2nd door mesh relative to the fridge mesh
door2Mesh.position.x = 1.2;
door2Mesh.position.y = 1;
door2Mesh.position.z = 0.55;
door2Mesh.userData.isopen = 0;
meshFridge.add(door2Mesh);


//create 2nd door handle
var handle2Geometry=new THREE.BoxGeometry(0.1, 0.3, 0.1);
var handle2Material = new THREE.MeshBasicMaterial({ map: texture});
var handle2Mesh= new THREE.Mesh(handle2Geometry, handle2Material);

handle2Mesh.position.z=-1;
handle2Mesh.position.x=0.1;

door2Mesh.add(handle2Mesh);

// create the side wall of fridge
var wallGeometry = new THREE.BoxGeometry(0.1, 3, 1.1);
var wallMaterial = new THREE.MeshBasicMaterial({ map: texture });
var wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
// position the wall mesh relative to the fridge mesh
wallMesh.position.x = 0.6;
wallMesh.position.z= 0.55;
wallMesh.rotation.y = Math.PI / 2; // rotate the wall mesh by 90 degrees around the y-axis

meshFridge.add(wallMesh);

// create the side wall of fridge
var wall2Geometry = new THREE.BoxGeometry(0.1, 3, 1.1);
var wallMaterial = new THREE.MeshBasicMaterial({ map: texture });
var wall2Mesh = new THREE.Mesh(wall2Geometry, wallMaterial);
// position the wall mesh relative to the fridge mesh
wall2Mesh.position.x = 0.6;
wall2Mesh.position.z= -0.55;
wall2Mesh.rotation.y = Math.PI / 2; // rotate the wall mesh by 90 degrees around the y-axis

meshFridge.add(wall2Mesh);

// create the roof of the fridge
var roofGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.2);
var roofMaterial = new THREE.MeshBasicMaterial({ map: texture });
var roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
// position the roof mesh above the fridge mesh
roofMesh.position.y = 1.55;
roofMesh.position.x=0.55;

meshFridge.add(roofMesh);

//create shelf5
var shelf5Geometry=new THREE.BoxGeometry(1.1, 0.1, 1.1);
var shelf5Material = new THREE.MeshBasicMaterial({ map: texture});
var shelf5Mesh= new THREE.Mesh(shelf5Geometry, shelf5Material);

shelf5Mesh.position.y=1;
shelf5Mesh.position.x=0.55;

meshFridge.add(shelf5Mesh);

//create shelf
var shelfGeometry=new THREE.BoxGeometry(1.2, 0.1, 1.0);
var shelfMaterial = new THREE.MeshBasicMaterial({ map: texture});
var shelfMesh= new THREE.Mesh(shelfGeometry, shelfMaterial);

shelfMesh.position.y=0.50;
shelfMesh.position.x=0.55;

meshFridge.add(shelfMesh);

//create shelf2
var shelf2Geometry=new THREE.BoxGeometry(1.1, 0.1, 1.1);
var shelf2Material = new THREE.MeshBasicMaterial({ map: texture});
var shelf2Mesh= new THREE.Mesh(shelf2Geometry, shelf2Material);

shelf2Mesh.position.y=0;
shelf2Mesh.position.x=0.55;

meshFridge.add(shelf2Mesh);

//create shelf3
var shelf3Geometry=new THREE.BoxGeometry(1.1, 0.1, 1.1);
var shelf3Material = new THREE.MeshBasicMaterial({ map: texture});
var shelf3Mesh= new THREE.Mesh(shelf3Geometry, shelf3Material);

shelf3Mesh.position.y=-0.50;
shelf3Mesh.position.x=0.55;

meshFridge.add(shelf3Mesh);

//create shelf4
var shelf4Geometry=new THREE.BoxGeometry(1.1, 0.1, 1.1);
var shelf4Material = new THREE.MeshBasicMaterial({ map: texture});
var shelf4Mesh= new THREE.Mesh(shelf4Geometry, shelf4Material);

shelf4Mesh.position.y=-1;
shelf4Mesh.position.x=0.55;

meshFridge.add(shelf4Mesh);


// create the floor of the fridge
var floorGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.2);
var floorMaterial = new THREE.MeshBasicMaterial({ map: texture });
var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
// position the floor mesh below the fridge mesh
floorMesh.position.y = -1.55;
floorMesh.position.x=0.55;

meshFridge.add(floorMesh);
meshFridge.position.x=x;
meshFridge.position.y=y;
meshFridge.position.z=z;
}


function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  // Additional rendering or updating logic for your scene can be added here
}

animate();

// create a raycaster object
var raycaster = new THREE.Raycaster();

// add a click event listener to the renderer
renderer.domElement.addEventListener('click', onMouseClick);

function onMouseClick(event) {
  // calculate mouse position in normalized device coordinates
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // set the raycaster position and direction based on the camera and mouse position
  raycaster.setFromCamera(mouse, camaraPerspetiva);

  // get the objects that intersect with the raycaster
  var intersects = raycaster.intersectObjects([doorMesh,door2Mesh]);

  // if the ray intersects with the fridge door, toggle its state
  // check if any object was intersected
  if (intersects.length > 0) {
      var intersectedObject = intersects[0].object;
      triggerdoor(intersectedObject);
    }
  }



/********************************************************
 *                          SKYBOX                      *    
 * ******************************************************/

/*código default

//Carregamento de texturas para as variáveis
var texture_dir = new THREE.TextureLoader().load('./Skybox/posx.jpg');      //imagem da direita
var texture_esq = new THREE.TextureLoader().load('./Skybox/negx.jpg');      //imagem da esquerda
var texture_up = new THREE.TextureLoader().load('./Skybox/posy.jpg');      //imagem de cima
var texture_dn = new THREE.TextureLoader().load('./Skybox/negy.jpg');      //imagem de baixo
var texture_bk = new THREE.TextureLoader().load('./Skybox/posz.jpg');      //imagem de trás
var texture_ft = new THREE.TextureLoader().load('./Skybox/negz.jpg');      //imagem da frente

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

//Criação da geometria do skybox
var skyboxGeo = new THREE.BoxGeometry(100, 100, 100);

//Criação da mesh que vai conter a geometria e as texturas
var skybox = new THREE.Mesh(skyboxGeo, materialArray);

//adicionar o skybox à cena
cena.add(skybox);*/


function createPathStrings(filename)
{
    var path = "./Skybox/";
    var baseFileName = path + filename;
    var format = ".tga";
    var sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    var pathStrings = sides.map(function(side) {
        return baseFileName + "_" + side + format;
    });
    return pathStrings;
}//isto deve criar um array de strings com o path de cada imagem do género ['./SkyBox/stormydays_ft.tga', './SkyBox/stormydays_bk.tga', ...]

//agora temos de dar load de cada textura usando o TextureLoader.load().
//Para isso, vamos usar a função map() que vai percorrer o array de strings e carregar cada uma das texturas.

function createMaterialArray(filename){
    var skyboxImagepaths = createPathStrings(filename);
    var textureLoader = new THREE.TextureLoader();
    var materialArray = skyboxImagepaths.map(function(image){
        let texture = new THREE.TextureLoader().load(image);

        return new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
    });

    return materialArray;
}

//Criação do array de materiais que vai conter as texturas
var materialArray = createMaterialArray('stormydays');

//Criação da geometria do skybox
var skyboxGeo = new THREE.BoxGeometry(100, 100, 100);

var skyboxMaterial = new THREE.MeshStandardMaterial(materialArray);

//Criação da mesh que vai conter a geometria e as texturas
var skybox = new THREE.Mesh(skyboxGeo, skyboxMaterial);

//adicionar o skybox à cena
cena.add(skybox);

// BOTÃO PARA MUDAR DE CÂMARAS ------------------------------------------------------
/*var btnCamaras = document.getElementById('ChangeView');
btnCamaras.onclick = function () 
{
    if (this._cameraState.type == CameraMode.Perspective) {
        this._mainCamera = this._perspectiveCamera;
        this._mainCamera.position.copy(this._orthographicCamera.position);
        this._mainCamera.rotation.copy(this._orthographicCamera.rotation);
      } else if (this._cameraState.type == CameraMode.Orthographic) {
        this._mainCamera = this._orthographicCamera;
        this._mainCamera.position.copy(this._perspectiveCamera.position);
        this._mainCamera.rotation.copy(this._perspectiveCamera.rotation);
      }
    
      this._control.object = this._mainCamera;
}
*/

function Start() {

    create_frigo(-10.25,1.1,-10);
    cena.add(meshFridge);
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

    //luz ambiente
    var luzAmbiente = new THREE.AmbientLight(0x404040, 0.5); // soft white light
    cena.add(luzAmbiente);
    
    //luz direcional
    var luzDirecional = new THREE.DirectionalLight(0xffffff, 0.5);
        //ligeiramente acima de cena para que os raios entrem na cena de cima para baixo
        luzDirecional.position.set(0, 1, 0);
    cena.add(luzDirecional);

    //luz pontual
    var luzPontual = new THREE.PointLight(0xffffff, 0.5);
    luzPontual.position.set(0, 1, 0);
    cena.add(luzPontual);

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
