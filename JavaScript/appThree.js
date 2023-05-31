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

//let mixer; 
//const clock = new THREE.Clock();

var doguinhoDirection = 1, doguinhoSpeed = 0.02;
var walkingTime = 0, maxWalkingTime = 15 * 1000; // 15 seconds


let isPerspectiveCameraActive = true;

var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100);

// CamaraStart
camaraPerspetiva.position.set(-8.5, 2, -17.2); // Camara posicionada à frente da prateleira
camaraPerspetiva.lookAt(new THREE.Vector3(-8.5, 1.5, -14.2)); // Câmara a olhar para a prateleira

 //camaraPerspetiva.position.set(-4.5, 2, -23); // Câmara inicializada à frente das duas portas da entrada)
 //camaraPerspetiva.lookAt(new THREE.Vector3(-4.5, 2, 2)); //Câmara a olhar para o corredor

camara.updateProjectionMatrix();

renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

//luz ambiente
var luzAmbiente = new THREE.AmbientLight(0x404040, 1); // soft white light
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

/********************************************************
                    GRID HELPER
*********************************************************/

const size = 100;
const divisions = 100;

/* const gridHelper1 = new THREE.GridHelper( size, divisions );
gridHelper1.position.y = 1;
cena.add( gridHelper1 );
const gridHelper2 = new THREE.GridHelper( size, divisions );
gridHelper2.position.y = 0.8;
cena.add( gridHelper2 );
const gridHelper3 = new THREE.GridHelper( size, divisions );
gridHelper3.position.y = 0.5;
cena.add( gridHelper3 );
const gridHelper4 = new THREE.GridHelper( size, divisions );
gridHelper4.position.y = 1.3;
cena.add( gridHelper4 );
const gridHelper5 = new THREE.GridHelper( size, divisions );
gridHelper5.position.y = 1.8;
cena.add( gridHelper5 );
const gridHelper6 = new THREE.GridHelper( size, divisions );
gridHelper6.position.y = 2.3;
cena.add( gridHelper6 );
 */

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



// OUTLINES

// const Olight = new THREE.SpotLight(0x800080, 0.5, 5);
// cena.add(Olight);

/********************************************************
*                    IMPORT DE OBJETOS                  *
*********************************************************/
const emissiveColor = new THREE.Color(0x800080);
const emissiveIntensity = 0.5;
const emissiveMaterial = new THREE.MeshPhongMaterial({
    color: emissiveColor, // Set the emissive color
    emissive: emissiveColor, // Set the emissive color
    emissiveIntensity: emissiveIntensity, // Set the emissive intensity (adjust as needed)
    transparent: true,
    opacity: 0.1,
});

// Define the distance threshold for turning on the emissive light
const distanceThreshold = 10;

// Function to check if the camera is within the distance threshold
function isWithinDistanceThreshold(camaraPerspetiva, object) {
  const distance = camaraPerspetiva.position.distanceTo(object.position);
  return distance <= distanceThreshold;
}

importer.load('./Objetos/tudo2.fbx', function (object) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./Images/Colors.png');
    const material = new THREE.MeshPhongMaterial({ map: texture });


    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            child.material = material;
            // Increase the roughness value to make the material less reflective
            child.material.roughness = 1;

            // Adjust the metalness value to control how much the material reflects light
            child.material.metalness = 0;
        }
    });

    

    cena.add(object);

    object.rotation.y = Math.PI / 2; 

    object.scale.x = 0.015;
    object.scale.y = 0.015;
    object.scale.z = 0.015;

    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0   ;

    objetoImportado = object;
    importedObjects.push(object); 
});

importer.load('./Objetos/chao.fbx', function (object) {

    cena.add(object);

    object.rotation.y = Math.PI / 2; 

    object.scale.x = 0.015;
    object.scale.y = 0.015;
    object.scale.z = 0.015;

    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0   ;

    objetoImportado = object;
});

importer.load('./Objetos/teto.fbx', function (object) {

    cena.add(object);

    object.rotation.y = Math.PI / 2; 

    object.scale.x = 0.015;
    object.scale.y = 0.015;
    object.scale.z = 0.015;

    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0   ;

    objetoImportado = object;
});

importer.load('./Objetos/OldComputer.fbx', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/octexture.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.002;
    object.scale.y = 0.002;
    object.scale.z = 0.002;
  
    object.position.x = -7.8;
    object.position.y = 2.3;
    object.position.z = -14.3;
    
    object.rotateY(Math.PI / 2);

    objetoImportado = object;

});
var coin;
importerOBJ.load('./Objetos/coin.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/coin.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;            
        }
    
    });

const boundingGeometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI); // Adjust the size of the bounding mesh to fit the key
const boundingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // Set the material to be invisible
const boundingMesh = new THREE.Mesh(boundingGeometry, boundingMaterial);
    // Set the position and rotation of the bounding mesh to match the key object
        boundingMesh.position.copy(object.position);
        boundingMesh.rotation.copy(object.rotation);
        boundingMesh.scale.copy(object.scale);

    // Add the bounding mesh as a child of the key object

            object.add(boundingMesh);

  
    object.traverse(function (child) {
        if (child.isMesh && child === boundingMesh) {
          child.material = emissiveMaterial;
        }

    });
 
    cena.add(object);	

    object.scale.x = 0.2;
    object.scale.y = 0.2;
    object.scale.z = 0.2;
  
    object.position.x = -7.8;
    object.position.y = 1.3;
    object.position.z = -14.5;
    
    object.rotateX(Math.PI / -2);
    coin = object;
});

var comb;
importerOBJ.load('./Objetos/comb.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/comb.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.09;
    object.scale.y = 0.09;
    object.scale.z = 0.09;
  
    object.position.x = -6.7;
    object.position.y = 1.2;
    object.position.z =-7.7;

    object.rotateX(Math.PI / -2);
    object.rotateZ(Math.PI / -7);
    
    comb = object; 
    importedObjects.push(object);

});
var cup;
importerOBJ.load('./Objetos/cup.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/cup.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;
  
    object.position.x = -9.1;
    object.position.y = 1;
    object.position.z = -14.6;
    
    cup = object;
});

var key;
importerOBJ.load('./Objetos/key.obj', function (object) {
    
    var texture = new THREE.TextureLoader().load('./Images/key.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;
        }
    
    });

const boundingGeometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI); // Adjust the size of the bounding mesh to fit the key
const boundingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // Set the material to be invisible
const boundingMesh = new THREE.Mesh(boundingGeometry, boundingMaterial);
     // Set the position and rotation of the bounding mesh to match the key object
        boundingMesh.position.copy(object.position);
        boundingMesh.rotation.copy(object.rotation);
        boundingMesh.scale.copy(object.scale);

    // Add the bounding mesh as a child of the key object

            object.add(boundingMesh);

  
    object.traverse(function (child) {
        if (child.isMesh && child === boundingMesh) {
          child.material = emissiveMaterial;
        }

    });

    cena.add(object);


    
    object.scale.x = 0.2;
    object.scale.y = 0.2;
    object.scale.z = 0.2;
    
    object.position.x = -8.656;
    object.position.y = 1.9;
    object.position.z = -14.65;
    
    object.rotateX(Math.PI / 1);
    object.rotateZ(Math.PI / 4);

    key = object;
});

importerOBJ.load('./Objetos/knife.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/knife.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;
  
    object.position.x = -8.2;
    object.position.y = 1.3;
    object.position.z = -14.5;
    
    object.rotateX(Math.PI / -2);
    object.rotateZ(Math.PI / -1.3);

    objetoImportado = object;
});

importerOBJ.load('./Objetos/opener.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/opener.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;
  
    object.position.x = 0.25;
    object.position.y = 1;
    object.position.z = 1.6;

    object.rotateX(Math.PI / -2);
    object.rotateZ(Math.PI / 2);
    
    objetoImportado = object;
});

importerOBJ.load('./Objetos/pencil.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/pencil.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;
  
    object.position.x = 0.25;
    object.position.y = 1;
    object.position.z = 1.7;

    object.rotateX(Math.PI / -2);
    object.rotateZ(Math.PI / -2);
    
    objetoImportado = object;
});

importerOBJ.load('./Objetos/spoon.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/spoon.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;
  
    object.position.x = 0.25;
    object.position.y = 1;
    object.position.z = 1.8;

    object.rotateY(Math.PI / 2);
    object.rotateX(Math.PI / -2);
    
    objetoImportado = object;
});

importerOBJ.load('./Objetos/spray.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/spray.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;
  
    object.position.x = -8.8;
    object.position.y = 1;
    object.position.z = -14.3;
    
    objetoImportado = object;
});

var tb;
importerOBJ.load('./Objetos/toothbrush.obj', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/toothbrush.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });

    const boundingGeometry = new THREE.SphereGeometry(1, 32, 32, 0, 4*Math.PI); // Adjust the size of the bounding mesh to fit the key
    const boundingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // Set the material to be invisible
    const boundingMesh = new THREE.Mesh(boundingGeometry, boundingMaterial);
     // Set the position and rotation of the bounding mesh to match the key object
        boundingMesh.position.copy(object.position);
        boundingMesh.rotation.copy(object.rotation);
        boundingMesh.scale.copy(object.scale);

    // Add the bounding mesh as a child of the key object

            object.add(boundingMesh);

  
    object.traverse(function (child) {
        if (child.isMesh && child === boundingMesh) {
          child.material = emissiveMaterial;
        }

    });
 
    cena.add(object);	

    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;
  
    object.position.x = -8;
    object.position.y = 1.2;
    object.position.z = -7.7;
    
    object.rotateX(Math.PI / -2);
    //object.rotateZ(Math.PI / 2);
    
    tb = object;
});

//var importer = new THREE.OBJLoader();
importerOBJ.load('./Objetos/Podium.obj', function (object) {

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

    object.position.x = -4.5;
    object.position.y = 0;
    object.position.z = -21;

    objetoImportado = object;
});

var doguinho;
importer.load('./Objetos/Doguinho.fbx', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/DogBase.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });

    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;
        }
    
    });
 
    cena.add(object);	

    object.scale.x = 0.001;
    object.scale.y = 0.001;
    object.scale.z = 0.001;

    object.position.x = -4;
    object.position.y = 0;
    object.position.z = -17;

    doguinho = object;
    importedObjects.push(object);
    
    /*const mixer = new THREE.AnimationMixer(doguinho);

    importer.load('./Objetos/Walking.fbx', function (object) {
        const animations = object.animations;
      
        // Assign the animations to the mixer
        animations.forEach((animation) => {
        mixer.clipAction(animation).play();
        });
      });*/

});

importer.load('./Objetos/Burger.fbx', function (object) {
    cena.add(object);
    
    object.scale.x = 0.002;
    object.scale.y = 0.002;
    object.scale.z = 0.002;

    object.position.x = -2;
    object.position.y = 1.6;
    object.position.z = -14.5;
});

var banana;
importer.load('./Objetos/Banana.fbx', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/Banana_basecolor.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });
    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;

        }
    
    });
    const boundingGeometry = new THREE.SphereGeometry(100, 32, 32, 0, 4*Math.PI); // Adjust the size of the bounding mesh to fit the key
    const boundingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // Set the material to be invisible
    const boundingMesh = new THREE.Mesh(boundingGeometry, boundingMaterial);
     // Set the position and rotation of the bounding mesh to match the key object
        boundingMesh.position.copy(object.position);
        boundingMesh.rotation.copy(object.rotation);
        boundingMesh.scale.copy(object.scale);

    // Add the bounding mesh as a child of the key object

            object.add(boundingMesh);

  
    object.traverse(function (child) {
        if (child.isMesh && child === boundingMesh) {
          child.material = emissiveMaterial;
        }

    });

    cena.add(object);
    
    object.scale.x = 0.002;
    object.scale.y = 0.002;
    object.scale.z = 0.002;

    object.position.x = -2;
    object.position.y = 0.6;
    object.position.z = -14.5;
    banana=object;
});

importer.load('./Objetos/Watermelon.fbx', function (object) {
    var texture = new THREE.TextureLoader().load('./Images/watermelon.jpg');
    var material = new THREE.MeshPhongMaterial({ map:texture });

    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;
        }
    
    });

    cena.add(object);
    
    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;

    object.position.x = -2;
    object.position.y = 1.3;
    object.position.z = -14.5;
});

var can;
importer.load('./Objetos/Can.fbx', function (object) {
    var texture = new THREE.TextureLoader().load('./Images/Can.png');
    var material = new THREE.MeshPhongMaterial({ map:texture });

    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;
        }
    
    });

    const boundingGeometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI); // Adjust the size of the bounding mesh to fit the key
    const boundingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // Set the material to be invisible
    const boundingMesh = new THREE.Mesh(boundingGeometry, boundingMaterial);
    // Set the position and rotation of the bounding mesh to match the key object
        boundingMesh.position.copy(object.position);
        boundingMesh.rotation.copy(object.rotation);
        boundingMesh.scale.copy(object.scale);

    // Add the bounding mesh as a child of the key object

            object.add(boundingMesh);
    cena.add(object);
    
    object.scale.x = 0.001;
    object.scale.y = 0.001;
    object.scale.z = 0.001;

    object.position.x = -2;
    object.position.y = 0.1;
    object.position.z = -14.5;
    can = object;

});

var hat;
importer.load('./Objetos/Hat.fbx', function (object) {
    var texture = new THREE.TextureLoader().load('./Images/hat.jpg');
    var material = new THREE.MeshPhongMaterial({ map:texture });

    object.traverse(function (child) 
    {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;
        }
    
    });

    const boundingGeometry = new THREE.SphereGeometry(20, 32, 32, 0, 4*Math.PI); // Adjust the size of the bounding mesh to fit the key
    const boundingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // Set the material to be invisible
    const boundingMesh = new THREE.Mesh(boundingGeometry, boundingMaterial);
     // Set the position and rotation of the bounding mesh to match the key object
        boundingMesh.position.copy(object.position);
        boundingMesh.rotation.copy(object.rotation);
        boundingMesh.scale.copy(object.scale);

    // Add the bounding mesh as a child of the key object

            object.add(boundingMesh);

  
    object.traverse(function (child) {
        if (child.isMesh && child === boundingMesh) {
          child.material = emissiveMaterial;
        }

    });

    cena.add(object);
    
    object.scale.x = 0.02;
    object.scale.y = 0.02;
    object.scale.z = 0.02;

    object.position.x = 0.5;
    object.position.y = 0.8;
    object.position.z = -11.5;
    hat = object;
});

//função para mudar entre as 2 câmaras
function mudarCamara() {
    //isPerspectiveCameraActive = !isPerspectiveCameraActive;
  
    // Set the active camera
    if (isPerspectiveCameraActive==true) {
      camara.position.copy(camaraPerspetiva.position);
      camara.rotation.copy(camaraPerspetiva.rotation);
      //renderer.render(cena, camaraPerspetiva);
      isPerspectiveCameraActive = false;
    } else {
      camaraPerspetiva.position.copy(camara.position);
      camaraPerspetiva.rotation.copy(camara.rotation);
      //renderer.render(cena, camara);
    isPerspectiveCameraActive = true;
    }
}

//função para ligar e desligar as luzes
function toggleLight(light) {
    light.visible = !light.visible;
}
const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);

/* score=score+0.008;
score2=score.toString();
score2=score2.slice(0,4);
document.getElementById("score").innerHTML=score2;
requestAnimationFrame(update); */


const popupWindow = document.getElementById('popupWindow'); 
const listaObjetos = [{name: 'Pencil', color:0xff0000},{name: 'Key', color:0xff0000}, {name: 'Toothbrush', color:0xff0000}, {name: 'Comb', color:0xff0000}];

var elementoHTML = document.createElement('p'); // is a node
elementoHTML.innerHTML = parseListaObjetos(listaObjetos);
console.log(popupWindow);
popupWindow.appendChild(elementoHTML);


//função para passar o array de objetos para a lista
function parseListaObjetos(lista) {
    let result = '';
    for (let i = 0; i < lista.length; i++) {
      const obj = lista[i];
      result += `${obj.name}<br>`;      //para mostrar apenas o nome do objeto
    }
    return result;
  }

function openPopupWindow() {
    popupWindow.style.display = 'block';
}

function closePopupWindow() {
    popupWindow.style.display = 'none';
}


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
    if (keyCode == 87) { // W key
        var raycaster = new THREE.Raycaster();
        var direction = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
        raycaster.set(controls.getObject().position, direction);
    
        var intersects = raycaster.intersectObjects(cena.children);
    
        if (intersects.length > 0 && intersects[0].distance < 0.5) {
          // There is an object too close, don't move forward
          return;
        } else {
          // No objects close enough, move forward
          controls.moveForward(0.25);
        }
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
    //comportamento para L, para abrir a janela pop-up(lista de objetos)
    if(keyCode == 76)
    {
      if (popupWindow.style.display === 'block') {
             closePopupWindow();
              } else {
                openPopupWindow();
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
var portaMesh;
var portaExteriorMesh;


function triggerdoor(mesh) {

  if (mesh.userData.isopen == 0) {
    doorAnimation = new TWEEN.Tween(mesh.rotation)
    .to({ y: Math.PI / -2 }, 1000) // Rotate the door to 90 degrees (open position) in 1 second
    .start()
    .onStart(function() {
        doorSound.play(); // Play the door opening sound
      })
    .onComplete(function () {
      mesh.userData.isopen = 1;
    });
  }else{
    doorAnimation = new TWEEN.Tween(mesh.rotation)
    .to({ y: 0 }, 1000) // Rotate the door to 0 degrees (closed position) in 1 second
    .start()
    .onStart(function() {
        cdoorSound.play(); // Play the door closing sound
      })
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
meshFridge.rotation.y = Math.PI / 2;

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
shelfMesh.position.x=0.56;

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

/********************************************************
 *                     portas                           *    
 * ******************************************************/

function create_porta(x,y,z, rotate){
    // create the porta mesh
    var portaGeometry = new THREE.BoxGeometry(0.1, 2.8, 1.9);  
    portaGeometry.translate( 0, 0, 1 );
    
    if (rotate) {
        // rotate thegeometry by 180 degrees around the y-axis
        portaGeometry.rotateY(Math.PI);
    }
    
    var texture = new THREE.TextureLoader().load('/Images/wood.jpg');
    var portaMaterial = new THREE.MeshBasicMaterial({ map:texture });
    portaMesh = new THREE.Mesh(portaGeometry, portaMaterial);
    portaMesh.userData.isopen = 0;
    portaMesh.position.x=x;
    portaMesh.position.y=y;
    portaMesh.position.z=z;
    return portaMesh;
}
// create the first set of doors
var portaMesh1 = create_porta(-2.6,1.35,-2.8, false);
cena.add(portaMesh1);
var portaMesh2 = create_porta(-2.6,1.35,-8.2, false);
cena.add(portaMesh2);
var portaMesh3 = create_porta(-2.6,1.35,-13.7, false);
cena.add(portaMesh3);

// create the other set of doors that open to the other side
var portaMesh4 = create_porta(-6.4,1.35,2.67, true);
cena.add(portaMesh4);
var portaMesh5 = create_porta(-6.4,1.35,-2.8, true);
cena.add(portaMesh5);
var portaMesh6 = create_porta(-6.4,1.35,-8.25, true);
cena.add(portaMesh6);

function create_portaexterior(x,y,z){
    // create the portaexterior mesh
    var portaExteriorGeometry = new THREE.BoxGeometry(0.1, 2.8, 3.7);  
    var texture = new THREE.TextureLoader().load('/Images/porta.jpg');
    var portaExteriorMaterial = new THREE.MeshBasicMaterial({ map:texture });
    portaExteriorMesh = new THREE.Mesh(portaExteriorGeometry, portaExteriorMaterial);
    portaExteriorMesh.rotation.y = Math.PI / 2;
    portaExteriorMesh.position.x=x;
    portaExteriorMesh.position.y=y;
    portaExteriorMesh.position.z=z;

}


/********************************************************
 *                        Prateleira                    *
 ********************************************************/

var meshCloset;

function create_armario(x,y,z)
{

    // Texturas globais para serem usadas pelos meshs todos
    
        var texture = new THREE.TextureLoader().load('./Images/Dcloset2.jpg');
        //var cmaterial = new THREE.MeshBasicMaterial({ map:texture });
        //var cmaterial = new THREE.MeshStandardMaterial({ map:texture });
        var cmaterial = new THREE.MeshPhongMaterial({ map:texture });

    // Middle Shelf Wall
        var wallGeometry = new THREE.BoxGeometry(0.95, 2.5, 0.1);
        meshCloset = new THREE.Mesh(wallGeometry, cmaterial);
        meshCloset.rotateY(Math.PI / 2);

    // ----------------------------------------------Side Walls--------------------------------------------------------

        // WALL 1 ( Bottom Right )
            var wall1Geometry= new THREE.BoxGeometry(1, 0.4, 0.1);
            var wall1Mesh= new THREE.Mesh(wall1Geometry, cmaterial);

            wall1Mesh.position.z = -0.95;
            wall1Mesh.position.y = -1.25;

            meshCloset.add(wall1Mesh);

        // WALL 2 ( Bottom Left )
            var wall2Geometry= new THREE.BoxGeometry(1, 0.9, 0.1);
            var wall2Mesh= new THREE.Mesh(wall2Geometry, cmaterial);

            wall2Mesh.position.z = 0.95;
            wall2Mesh.position.y = -1;

            meshCloset.add(wall2Mesh);

        // WALL 3 ( Mid Right )
            var wall3Geometry= new THREE.BoxGeometry(1, 0.9, 0.1);
            var wall3Mesh= new THREE.Mesh(wall3Geometry, cmaterial);

            wall3Mesh.position.z = -0.95;
            wall3Mesh.position.y = 0;

            meshCloset.add(wall3Mesh);

        // WALL 4 ( Mid Left )
            var wall4Geometry= new THREE.BoxGeometry(1, 0.9, 0.1);
            var wall4Mesh= new THREE.Mesh(wall4Geometry, cmaterial);

            wall4Mesh.position.z = 0.95;
            wall4Mesh.position.y = 0.5;

            meshCloset.add(wall4Mesh);

        // WALL 5 ( Top Right)
            var wall5Geometry= new THREE.BoxGeometry(1, 0.9, 0.1);
            var wall5Mesh= new THREE.Mesh(wall5Geometry, cmaterial);

            wall5Mesh.position.z = -0.95;
            wall5Mesh.position.y = 1;

            meshCloset.add(wall5Mesh)


    // ----------------------------------------------Prateleiras--------------------------------------------------------
            
        // Prateleira 1
            var shelf6Geometry=new THREE.BoxGeometry(1, 0.1, 1.045);
            var shelf6Mesh= new THREE.Mesh(shelf6Geometry, cmaterial);
    
            shelf6Mesh.position.y = 1.5;
            shelf6Mesh.position.z = -0.478;

            meshCloset.add(shelf6Mesh);
                
        //Prateleira 2
            var shelf5Geometry=new THREE.BoxGeometry(1, 0.1, 1);
            var shelf5Mesh= new THREE.Mesh(shelf5Geometry, cmaterial);

            shelf5Mesh.position.y = 1;
            shelf5Mesh.position.z = 0.5;

            meshCloset.add(shelf5Mesh);
                
        // Prateleira 3
            var shelfGeometry=new THREE.BoxGeometry(1, 0.1, 1);
            var shelfMesh= new THREE.Mesh(shelfGeometry, cmaterial);
    
            shelfMesh.position.y = 0.5;
            shelfMesh.position.z = -0.5;
            meshCloset.add(shelfMesh);

        // Prateleira 4   
            var shelf2Geometry=new THREE.BoxGeometry(1, 0.1, 1);
            var shelf2Mesh= new THREE.Mesh(shelf2Geometry, cmaterial);
    
            shelf2Mesh.position.y = 0;
            shelf2Mesh.position.z = 0.5;
    
            meshCloset.add(shelf2Mesh);
    
        //Prateleira 5
            var shelf3Geometry=new THREE.BoxGeometry(1, 0.1, 2);
            var shelf3Mesh= new THREE.Mesh(shelf3Geometry, cmaterial);
    
            shelf3Mesh.position.y=-0.5;    
            meshCloset.add(shelf3Mesh);
    
        //Prateleira 6
            var shelf4Geometry=new THREE.BoxGeometry(1, 0.1, 1.9);
            var shelf4Mesh= new THREE.Mesh(shelf4Geometry, cmaterial);
    
            shelf4Mesh.position.y = -1;
            shelf4Mesh.position.z = -0.05;  
            meshCloset.add(shelf4Mesh);

    // NÃO MEXER
        meshCloset.position.x=x;
        meshCloset.position.y=y;
        meshCloset.position.z=z;

    // Translação de todos os childs da Mesh Principal (Tábua Central Vertical) ao longo do Y
        meshCloset.traverse(function(child) {
            if (child !== meshCloset) {
                child.position.y -= 0.25;
            }
            });           
}

/********************************************************
 *                        Candeeiro                     *    
 ********************************************************/

var meshLamp;

function create_lamp(x,y,z)
{

    // Texturas globais para serem usadas pelos meshs     
        var headtexture = new THREE.TextureLoader().load('./Images/LampHead2.jpg');
        var bodytexture = new THREE.TextureLoader().load('./Images/Metal.jpg');
        var basetexture = new THREE.TextureLoader().load('./Images/Dcloset.jpg');

    // Middle Shelf Wall
        //var wallGeometry = new THREE.BoxGeometry(0.95, 2.5, 0.1);
        //meshLamp = new THREE.Mesh(wallGeometry, cmaterial);


    // Lamp Body (cilindro)
        var bodyGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 32);
        var bodyMaterial = new THREE.MeshPhongMaterial({ map:bodytexture });
        meshLamp = new THREE.Mesh(bodyGeometry, bodyMaterial);
        
    // Lamp Cone (Light Emitter)
        var lightGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);
        var lightMaterial = new THREE.MeshPhongMaterial({ map:headtexture });
        var lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);

        lightMesh.position.y = 1; 
        meshLamp.add(lightMesh);

    // Lamp Base
        var baseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
        var baseMaterial = new THREE.MeshPhongMaterial({ map:basetexture });
        var baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        
        baseMesh.rotateY(Math.PI / 2);
        baseMesh.position.y = -0.95;

        meshLamp.add(baseMesh);

    // Light
        var lamppointlight = new THREE.PointLight(0xffffff, 1, 5);
        lamppointlight.position.copy(lightMesh.position);
        meshLamp.add(lamppointlight);
        lamppointlight.lookAt(baseMesh.position);

    // NÃO MEXER
        meshLamp.position.x=x;
        meshLamp.position.y=y;
        meshLamp.position.z=z;

}

/********************************************************
 *                      Sound Effects                   *
 ********************************************************/
var listener = new THREE.AudioListener();
camaraPerspetiva.add(listener); // Assuming your camera is in the scene
// coin.add(listener);
// key.add(listener);
var audioLoader = new THREE.AudioLoader();
var doorSound = new THREE.PositionalAudio(listener);
var cdoorSound = new THREE.PositionalAudio(listener);
var pickUpItem = new THREE.PositionalAudio(listener);

//var pickupitem = new THREE.PositionalAudio(listener)

audioLoader.load('./Sounds/DoorOpen.mp3', function(buffer) {
  doorSound.setBuffer(buffer);
  doorSound.setRefDistance(20); // Adjust the reference distance as needed
  doorSound.setVolume(1);       // Adjust the volume as needed
});

audioLoader.load('./Sounds/DoorClose.mp3', function(buffer) {
    cdoorSound.setBuffer(buffer);
    cdoorSound.setRefDistance(20); // Adjust the reference distance as needed
    cdoorSound.setVolume(1);       // Adjust the volume as needed
  });

audioLoader.load('./Sounds/PickUpItem.wav', function(buffer) {
    pickUpItem.setBuffer(buffer);
    pickUpItem.setRefDistance(20); // Adjust the reference distance as needed
    pickUpItem.setVolume(1);       // Adjust the volume as needed
  });

audioLoader.load()


/********************************************************
 *                      Raycaster                       *
 ********************************************************/
var raycaster = new THREE.Raycaster();

// add a click event listener to the renderer
renderer.domElement.addEventListener('click', onMouseClick);

//RemoveFunction

function onMouseClick(event) {

        // Array of doors to trigger
    var doorArray = [doorMesh, door2Mesh, portaMesh1, portaMesh2, portaMesh3, portaMesh4, portaMesh5, portaMesh6];
  
        // Calculate mouse position in normalized device coordinates
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
        // Set the raycaster position and direction based on the camera and mouse position
    raycaster.setFromCamera(mouse, camaraPerspetiva);
  
    //     //Get the objects that intersect with the raycaster
    //     // var intersects = raycaster.intersectObjects(removeObjectArray);
    

    // CÓDIGO FEIO
    // const intersectsKey = raycaster.intersectObject(key)
    // const intersectsCoin = raycaster.intersectObject(coin);
    // const intersectsTb = raycaster.intersectObject(tb, true)
    // const intersectsComb = raycaster.intersectObject(comb, true)
    //     if (intersectsCoin.length > 0) {
    //         cena.remove(coin)
    //     }
    //     if (intersectsKey.length > 0) {
    //         cena.remove(key)
    //     }   
    //     if (intersectsTb.length > 0) {
    //         cena.remove(tb)
    //     } 
    //     if (intersectsComb.length > 0) {
    //         cena.remove(comb)
    //     } 

    // CÓDIGO BONITO
    var removeObjectArray = [key, coin, tb, comb, hat, banana];
    removeObjectArray.forEach(object=>{
          var ok = raycaster.intersectObject(object)
          if (ok.length>0)
          { 
            cena.remove(object);
            pickUpItem.play();
          }
      });

/*      function crossOff(object) {
        const listItems = document.querySelectorAll('#popupWindow p');
      
        for (let i = 0; i < listItems.length; i++) {
          const listItem = listItems[i];
          if (listItem.textContent.trim() === object.name) {
            listItem.classList.add('crossed-off');
            break; // Stop looping once the item is found and crossed off
          }
        }
      }*/

      
  // get the objects that intersect with the raycaster in the door array
 var doorIntersects = raycaster.intersectObjects(doorArray);

  // if the ray intersects with any of the doors in the array
  if (doorIntersects.length > 0) {
    var doorObject = doorIntersects[0].object;

    // call the triggerdoor function with the intersected door object as a parameter
    triggerdoor(doorObject);
  }
}



function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    // Additional rendering or updating logic for your scene can be added here
    
    // Move the dog back and forth
    if (doguinho) {
        // Move the dog back and forth
        doguinho.position.z += doguinhoSpeed * doguinhoDirection;

        // Increment the walking time
        walkingTime += 16; // Approximate milliseconds per frame

        // Change direction after 15 seconds
        if (walkingTime >= maxWalkingTime) {
          doguinhoDirection *= -1;
          doguinho.rotation.y += Math.PI; // Rotate the dog 180 degrees
          walkingTime = 0;
        }
      }
}
  animate();


/********************************************************
 *                          SKYBOX                      *    
 * ******************************************************/

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
cena.add(skybox);

/* not working
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
cena.add(skybox);*/

function Start() {

    create_frigo(-1.8,1.6,-14);
    cena.add(meshFridge);
    create_portaexterior(-4.5,1.35,-24.5);
    cena.add(portaExteriorMesh);

    create_armario(-8.5, 1.5, -14.2);
    cena.add(meshCloset);
    create_lamp(1, 1, -23);
    cena.add(meshLamp);

    //Criação de um foco de luz com a cor branca (#ffffff) e intensidade 1 (intensidade normal)
    var focoLuz = new THREE.SpotLight(0xffffff, 1);

    //Mudar a poisção da luz para ficar 5 unidades a cima de onde a câmara se encontra.~
    focoLuz.position.y = 5;
    focoLuz.position.z = 10;

    //Dizemos a light pata ficar a apontar para a poisção do cubo.
    focoLuz.lookAt(meshCloset.position);

    //Adicionamos a luz à cena.
    cena.add(focoLuz);


    renderer.render(cena, camaraPerspetiva);

    requestAnimationFrame(loop);
}

function loop() {

    //Necessário atualizar o mixer de animação tendo em conta o tempo desde o ultimo update.
    //relogio.getDelta() indica quanto tempo passou desde o último frame renderizado.
    if(mixerAnimacao){
        mixerAnimacao.update(relogio.getDelta());
    }

    if (isPerspectiveCameraActive==true) {
        camara.position.copy(camaraPerspetiva.position);
        camara.rotation.copy(camaraPerspetiva.rotation);
        renderer.render(cena, camaraPerspetiva);
      } else {
        camaraPerspetiva.position.copy(camara.position);
        camaraPerspetiva.rotation.copy(camara.rotation);
        renderer.render(cena, camara);
      }

    //renderer.render(cena, camaraPerspetiva);

    requestAnimationFrame(loop);
}

