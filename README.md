# Projeto-CG

OBJ
Como dar import a objetos do tipo blender? abrir como blender e exportar como FBX

 -  colocar a casa dentro de uma skybox porque podemos ver céu pelas janelas

# PERGUNTAR AO PROFESSOR
- Como dar import da biblioteca FBXLoader para poder dar load à nossa Skybox?

 # Easter Eggs
 - Para fazer os objetos brilharem basta definir uma PointLight no objeto, eles iram brilhar mais ou menos intensamente dependendo da distância da pessoa/câmara ao objeto


- *LISTA*:
    - Criar a estrutura HTML: Criar um elemento HTML para servir como janela pop-up. Este elemento conterá os itens da lista. Dê-lhe um ID exclusivo e estilize-o adequadamente.«
        <div id="listWindow" class="list-window">
        <!-- List items will be dynamically added here -->
        </div>

    - Estilar a janela da lista: Defina estilos CSS para a janela da lista para posicioná-la na tela, dar-lhe dimensões e definir sua aparência.

        .list-window {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 400px;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 20px;
        overflow-y: scroll;
        }

    - Criar uma função para adicionar itens à lista: Escreva uma função JavaScript que possa adicionar itens à janela pop-up. Esta função receberá os dados necessários para cada item da lista como entrada e gerará dinamicamente os elementos HTML para a lista. 

        function addListItem(text) {
        const listWindow = document.getElementById('listWindow');
        const listItem = document.createElement('div');
        listItem.textContent = text;
        listWindow.appendChild(listItem);
        }

    - Criar uma função para abrir/fechar a janela da lista: Implemente funções JavaScript que possam mostrar/ocultar a janela da lista quando necessário. Essas funções podem modificar a propriedade de exibição CSS do elemento da janela da lista.

        function openListWindow() {
        const listWindow = document.getElementById('listWindow');
        listWindow.style.display = 'block';
        }

        function closeListWindow() {
        const listWindow = document.getElementById('listWindow');
        listWindow.style.display = 'none';
        }

    - Lidar com interações e preencher a lista: Use os event listeners Three.js ou outros mecanismos de interação para acionar a abertura da janela da lista e preenchê-la com os itens da lista desejados. 

        function onButtonClick() {
        openListWindow();
        
        // Add list items dynamically
        addListItem('Item 1');
        addListItem('Item 2');
        addListItem('Item 3');
        }

        const button = document.getElementById('openButton');
        button.addEventListener('click', onButtonClick);

- *PROGRESS BAR*

    - Criar a barra de progresso: Crie um elemento HTML para servir como barra de progresso.

    <label for="loading">Progress bar:</label>
    <progress id="loading" value="50" max="100">50%</progress>

    - Atualizar o CSS para colocar na posição que queremos a barra
    
    .ui {
    position: absolute;
    }

    - <progress class="ui" id="loading" value="50" max="100">50%</progress>

    - Implementar na lógica que cada vez que se interaje/recolhe um objeto a barra de progresso aumenta x %

    *IMPORT DE OBJETOS E APLICAÇÃO DAS TEXTURAS* ----------------------------------------------------------------------------------

    importer.load('./Objetos/NOMEOBJETO.fbx', function (object) {

    var texture = new THREE.TextureLoader().load('./Images/TEXTURAIMG.jpg');
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
  
    object.position.x = -12.8;
    object.position.y = -0.5;
    object.position.z = -10.3;
    
    objetoImportado = object; 

});

NOTA: SE O OBJETO FOR DO TIPO .OBJ, EM VEZ DE USAR O IMPORTER.LOAD, USAR O IMPORTEROBJ.LOAD





*TIPS AND TRICKS COM A CÂMARA*

    - CTRL+F ou F3;
    - Procurar "CamaraStart";
    - Bem comentado, não é preciso ser um génio da matemática para entender;
    - Se quiserem mexer no posicionamento da câmara COPIEM O QUE ESTÁ LÁ E CRIEM UMA NOVA, COMENTANDO AS OUTRAS. Assim temos diferentes pontos de inicio para a câmara para n termos de percorrer a casa toda para ver as mudanças. Podem adicionar as linhas de código da posição da câmara para depois podermos escolher entre elas;
    - A câmara está, no ato de escrita deste documento, posicionada à frente da prateleira a olhar para a mesma;
    - Para o import dos objetos têm acima o código de import para .fbx e .obj para copiarem. Para colocarem no código, têm uma imagem para ajudar (/Images/ORIENTAÇÃO DA CASA.png). É confuso no início, especialmente se estiverem a tentar rodar os objetos e se andam pela casa, experimentem até deixar de ser confuso;

GRIDHELPER

    - Mesma coisa em cima, pesquisem o GridHelper com o CTRL+F, podem criar mais gridhelpers se necessário ou comentar os que estão;
    - Isto ajuda imenso a posicionar os objetos. Criei vários com alturas diferentes para preencher as diferentes alturas da prateleira e deu grande jeito. Se não precisarem, deixem apenas o GridHelper com y = 1 (abaixo da câmara e acima do chão da casa);
    
