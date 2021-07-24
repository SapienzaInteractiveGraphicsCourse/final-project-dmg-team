import * as DEF from './definitions.js'
import * as THREE from '../three.js-master/build/three.module.js';
import * as ANIMA from './animations.js'
import * as GAME from './game.js'
import {OrbitControls} from '../three.js-master/examples/jsm/controls/OrbitControls.js';
import TWEEN, { Tween } from './lib/tween.esm.js'


function initRobotTweens(robot) {

    //
    // Obtain actual rotation
    //
    let rotations = {
        ankle: 0,
        knee: 0,
        hip: 0,
        neck: 0,
        shoulder: 0,
        elbow: 0
    };
    robot.traverse(function(child) {
        if (child.name == 'joint_ankle')
            rotations.ankle = child.rotation
        if (child.name == 'joint_knee')
            rotations.knee = child.rotation
        if (child.name == 'joint_hip')
            rotations.hip = child.rotation
        if (child.name == 'joint_neck')
            rotations.neck = child.rotation
        if (child.name == 'joint_shoulder')
            rotations.shoulder = child.rotation
        if (child.name == 'joint_elbow')
            rotations.elbow = child.rotation
    });

    //
    // Define constraints for the animation
    //
    const ankleConstraints = DEF.robotProperties.joints.body.ankle.constraints;
    const kneeConstraints = DEF.robotProperties.joints.body.knee.constraints;
    const hipConstraints = DEF.robotProperties.joints.body.hip.constraints;
    const neckConstraints = DEF.robotProperties.joints.body.neck.constraints;
    const shoulderConstraints = DEF.robotProperties.joints.arm.shoulder.constraints;
    const elbowConstraints = DEF.robotProperties.joints.arm.elbow.constraints;

    //
    // Define 4 tweens for each joint of the robot
    //
    const forwardTween = {
        ankle: new TWEEN.Tween({z: rotations.ankle.z}).to({z: ankleConstraints.z[1]}, 1000),
        knee: new TWEEN.Tween({z: rotations.knee.z}).to({z: kneeConstraints.z[1]}, 1000),
        hip: new TWEEN.Tween({z: rotations.hip.z}).to({z: hipConstraints.z[1]}, 1000),
        neck: new TWEEN.Tween({z: rotations.neck.z}).to({z: neckConstraints.z[1]}, 1000),
        shoulder: new TWEEN.Tween({z: rotations.shoulder.z}).to({z: shoulderConstraints.z[1]}, 1000),
        elbow: new TWEEN.Tween({z: rotations.elbow.z}).to({z: elbowConstraints.z[1]}, 1000),
    }
    const backwardTween = {
        ankle: new TWEEN.Tween({z: rotations.ankle.z}).to({z: ankleConstraints.z[0]}, 1000),
        knee: new TWEEN.Tween({z: rotations.knee.z}).to({z: kneeConstraints.z[0]}, 1000),
        hip: new TWEEN.Tween({z: rotations.hip.z}).to({z: hipConstraints.z[0]}, 1000),
        neck: new TWEEN.Tween({z: rotations.neck.z}).to({z: neckConstraints.z[0]}, 1000),
        shoulder: new TWEEN.Tween({z: rotations.shoulder.z}).to({z: shoulderConstraints.z[0]}, 1000),
        elbow: new TWEEN.Tween({z: rotations.elbow.z}).to({z: elbowConstraints.z[0]}, 1000),
    }
    const leftwardTween = {
        ankle: new TWEEN.Tween({y: rotations.ankle.y}).to({y: ankleConstraints.y[1]}, 1000),
        knee: new TWEEN.Tween({y: rotations.knee.y}).to({y: kneeConstraints.y[1]}, 1000),
        hip: new TWEEN.Tween({y: rotations.hip.y}).to({y: hipConstraints.y[1]}, 1000),
        neck: new TWEEN.Tween({y: rotations.neck.y}).to({y: neckConstraints.y[1]}, 1000),
        shoulder: new TWEEN.Tween({y: rotations.shoulder.y}).to({y: shoulderConstraints.y[1]}, 1000),
        elbow: new TWEEN.Tween({y: rotations.elbow.y}).to({y: elbowConstraints.y[1]}, 1000),
    }
    const rightwardTween = {
        ankle: new TWEEN.Tween({y: rotations.ankle.y}).to({y: ankleConstraints.y[0]}, 1000),
        knee: new TWEEN.Tween({y: rotations.knee.y}).to({y: kneeConstraints.y[0]}, 1000),
        hip: new TWEEN.Tween({y: rotations.hip.y}).to({y: hipConstraints.y[0]}, 1000),
        neck: new TWEEN.Tween({y: rotations.neck.y}).to({y: neckConstraints.y[0]}, 1000),
        shoulder: new TWEEN.Tween({y: rotations.shoulder.y}).to({y: shoulderConstraints.y[0]}, 1000),
        elbow: new TWEEN.Tween({y: rotations.elbow.y}).to({y: elbowConstraints.y[0]}, 1000),
    }
    const catchTween = new TWEEN.Tween();
    const robotTweens = {
        movement: {
            forward: forwardTween, 
            backward: backwardTween, 
            leftward: leftwardTween, 
            rightward: rightwardTween
        }, 
        catch: catchTween
    };
    return robotTweens
}

function initKeyListener(scene, objects) {
    let robotTweens = initRobotTweens(objects.robot);
    let constraintsReached = {
        forward: {
            ankle: false,
            knee: false,
            hip: false,
            neck: false,
            shoulder: false,
            elbow: true
        },
        backward: {
            ankle: true,
            knee: true,
            hip: false,
            neck: false,
            shoulder: false,
            elbow: false
        },
        leftward: {
            ankle: false,
            knee: true,
            hip: true,
            neck: false,
            shoulder: false,
            elbow: false
        },
        rightward: {
            ankle: false,
            knee: true,
            hip: true,
            neck: false,
            shoulder: false,
            elbow: false
        }
    };
    document.onkeydown = function(key) {
        GAME.play(scene, key, objects, robotTweens.movement, constraintsReached);
    };
    document.onkeyup = function() {
        Object.keys(robotTweens.movement).forEach(function(dirTween) {
            Object.keys(robotTweens.movement[dirTween]).forEach(function(tween) {
                robotTweens.movement[dirTween][tween].stop();
            });
        });
        robotTweens = initRobotTweens(objects.robot);
    }
    return null
}

function initPlayListener(camera, renderer, cameraControls) {
    document.getElementById("Play_Button").addEventListener("click", function(){ANIMA.startCameraAnimation(camera, renderer)});
    cameraControls.enabled = false;
    return null
}

function initRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = DEF.shadowsOn;
    document.body.appendChild(renderer.domElement);
    return renderer
}

function initCamera(cameraProperties) {
    const camera = new THREE.PerspectiveCamera(
        cameraProperties.fov, 
        cameraProperties.aspect, 
        cameraProperties.near,
        cameraProperties.far
    );
    camera.position.set(
        cameraProperties.position.x,
        cameraProperties.position.y,
        cameraProperties.position.z
    );
    return camera
}

function initScene(sceneProperties) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
        sceneProperties.backgroundColor);
    return scene
}

function initLights(scene, lightsProperties) {

    // Directional light
    const directionalLight = new THREE.DirectionalLight(
        lightsProperties.directional.color, 
        lightsProperties.directional.intensity
    );
    directionalLight.position.set(
        lightsProperties.directional.position.x,
        lightsProperties.directional.position.y,
        lightsProperties.directional.position.z
    );
    if (DEF.shadowsOn) {
        directionalLight.castShadow = lightsProperties.directional.shadows.cast;
        directionalLight.shadow.camera.left = - lightsProperties.directional.shadows.cameraSide;
        directionalLight.shadow.camera.right = lightsProperties.directional.shadows.cameraSide;
        directionalLight.shadow.camera.top = lightsProperties.directional.shadows.cameraSide;
        directionalLight.shadow.camera.bottom = - lightsProperties.directional.shadows.cameraSide;
        directionalLight.shadow.mapSize.width = lightsProperties.directional.shadows.mapWidth;
        directionalLight.shadow.mapSize.height = lightsProperties.directional.shadows.mapHeight;
        directionalLight.shadow.camera.near = lightsProperties.directional.shadows.cameraNear;
        directionalLight.shadow.camera.far = lightsProperties.directional.shadows.cameraFar;
    }
    if (lightsProperties.directional.helper == true) {
        const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        scene.add(cameraHelper);
    }
    scene.add(directionalLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(
        lightsProperties.ambient.color, 
        lightsProperties.ambient.intensity
    );
    scene.add(ambientLight);

    // Hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(
        lightsProperties.hemisphere.skyColor,
        lightsProperties.hemisphere.groundColor,
        lightsProperties.hemisphere.intensity
    );
    hemisphereLight.position.set(
        lightsProperties.hemisphere.position.x,
        lightsProperties.hemisphere.position.y,
        lightsProperties.hemisphere.position.z
    );
    scene.add(hemisphereLight);

    return {
        directional: directionalLight,
        ambient: ambientLight,
        hemisphere: hemisphereLight
    }
}

function initCameraControls(camera, renderer, cameraTarget) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(
        cameraTarget.x, 
        cameraTarget.y, 
        cameraTarget.z
    );
    controls.update();
    return controls
}


export {initRenderer, initCamera, initScene, initLights, initCameraControls, initKeyListener, initPlayListener}
