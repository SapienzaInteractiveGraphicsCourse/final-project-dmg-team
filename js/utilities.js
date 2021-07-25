import * as MAIN from './main.js'
import * as DRAW from './draw.js'
import * as DEF from './definitions.js'
import * as INIT from './initialization.js'
import * as THREE from './lib/three.js-master/build/three.module.js';
import {OBJLoader} from './lib/three.js-master/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from './lib/three.js-master/examples/jsm/loaders/MTLLoader.js';


// _________________ Display _________________ //


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}


// _________________ Loading _________________ //


let audioLoaded = false;
let modelsLoaded = false;

function startLoading() {

    // Load main elements
    const camera = INIT.initCamera(DEF.cameraProperties);
    const renderer = INIT.initRenderer();
    const scene = INIT.initScene(DEF.sceneProperties);

    // Load sounds
    /*const audioLoadManager = new THREE.LoadingManager();
    audioLoadManager.onProgress = function() {
        console.log("Loading audio...");
    };
    audioLoadManager.onLoad = function() {
        console.log('Loading audio complete!');
        audioLoaded = true;
        if (audioLoaded && modelsLoaded)
            MAIN.main(camera, renderer, scene, objects);
    };
    INIT.initAudio(audioLoadManager, camera, DEF.audioProperties.path);*/

    // Load Models
    let objects;
    const modelsLoadManager = new THREE.LoadingManager();
    modelsLoadManager.onProgress = function() {
        console.log("Loading models...");
    };
    modelsLoadManager.onLoad = function() {
        console.log('Loading models complete!');
        modelsLoaded = true;
        //if (audioLoaded && modelsLoaded)
        if (modelsLoaded)
            MAIN.main(camera, renderer, scene, objects);
    };
    objects = DRAW.drawAll(modelsLoadManager, scene);
}
startLoading();

// _________________ Meshes _________________ //    


function getMaterial(material_type, textureProperties) {
    let material;
    let texture;
    if (textureProperties.map != null) {
        const loader = new THREE.TextureLoader();
        texture = loader.load(textureProperties.map);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(textureProperties.repeat.x, textureProperties.repeat.y);
        texture.anisotropy = textureProperties.anisotropy;
    } else texture = null;
    switch (material_type) {
        case null: 
        case 'phong':
            material = new THREE.MeshPhongMaterial({color:textureProperties.color, map:texture}); 
            break;
        case 'lambert':
            material = new THREE.MeshLambertMaterial({color:textureProperties.color, map:texture});
            break;
        case 'basic':
            material = new THREE.MeshBasicMaterial({color:textureProperties.color, map:texture});
            break;
        case 'basic_line':
            material = new THREE.LineBasicMaterial({color:textureProperties.color});
            break;
    };
    return material 
}

function createGeometry(name, size) {
    let geometry;
    switch (name) {
        case null:
        case 'box':
            geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(
                size.radius, size.widthDivisions, size.heightDivisions);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(
                size.radiusTop, size.radiusBottom, size.height, 
                size.radialDivisions, size.heightDivisions);
            break;
        case 'plane':
            geometry = new THREE.PlaneGeometry(size.width, size.height);
            break;
        case 'line':
            const points = [];
            points.push(new THREE.Vector3(size.start.x, size.start.y, size.start.z));
            points.push(new THREE.Vector3(size.end.x, size.end.y, size.end.z));
            geometry = new THREE.BufferGeometry().setFromPoints(points);
            break;
    }
    return geometry
}

function createMesh(meshProperties, material_type=null) {
    const color = meshProperties.texture.color;
    const material = getMaterial(material_type, meshProperties.texture);
    const geometry = createGeometry(meshProperties.type, meshProperties.size);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        meshProperties.position.x,
        meshProperties.position.y,
        meshProperties.position.z
    );
    mesh.rotation.set(
        meshProperties.rotation.x,
        meshProperties.rotation.y,
        meshProperties.rotation.z
    );
    if (DEF.shadowsOn) {
        mesh.castShadow = meshProperties.shadows.cast,
        mesh.receiveShadow = meshProperties.shadows.receive
    };
    mesh.name = meshProperties.name;  
    return mesh;
}

function createLine(lineProperties) {
    const geometry = createGeometry('line', lineProperties.size);
    const material = getMaterial('basic_line', lineProperties.texture);
    const line = new THREE.Line(geometry, material)
    return line
}

function createObject(LoadingManager, objProperties) {
    let object = new THREE.Object3D();
    const mtlLoader = new MTLLoader();
    mtlLoader.load(objProperties.path.mtl, (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader(LoadingManager);
        objLoader.setMaterials(mtl);
        objLoader.load(objProperties.path.obj, (root) => {
            if (DEF.shadowsOn) {
                root.traverse(function(child){
                    child.castShadow = objProperties.shadows.cast;});
                root.traverse(function(child){
                    child.receiveShadow = objProperties.shadows.receive;});
            }
            object.add(root);
        }); 
    });
    object.position.set(
        objProperties.position.x,
        objProperties.position.y,
        objProperties.position.z
    );
    object.rotation.set(
        objProperties.rotation.x,
        objProperties.rotation.y,
        objProperties.rotation.z
    );
    return object
}


export {
    resizeRendererToDisplaySize,
    getMaterial,
    createGeometry, createMesh, createLine, createObject
};
