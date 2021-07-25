import * as DEF from './definitions.js'
import * as ANIMA from './animations.js'
import * as GAME from './game.js'
import * as THREE from './lib/three.js-master/build/three.module.js';
import {OrbitControls} from './lib/three.js-master/examples/jsm/controls/OrbitControls.js';
import TWEEN from './lib/tween.esm.js'


function initFishingPoleTweens(fishingPole) {
    //
    // Obtain actual rotation
    //
    let rotation;
    let scale;
    fishingPole.traverse(function (child) {
        if (child.name == 'fishLineJoint')
            rotation = child.rotation;
        if (child.name == 'fishLineMain')
            scale = child.scale;
    });

    //
    // Define constraints for the animation
    //
    const fishingPoleConstraints = DEF.fishingPoleProperties.fishline.main.constraints;

    //
    // Define tweens for the fishing pole's joint
    //
    const fishingPoleTweens = {
        forward: {
            move: new TWEEN.Tween({z: rotation.z}).to({z: fishingPoleConstraints.z[1]}, 1000),
            scale: new TWEEN.Tween({y: scale.y}).to({y: fishingPoleConstraints.y[1]}, 1000),
        },
        backward: {
            move: new TWEEN.Tween({z: rotation.z}).to({z: fishingPoleConstraints.z[0]}, 1000),
            scale: new TWEEN.Tween({y: scale.y}).to({y: fishingPoleConstraints.y[0]}, 1000),
        }
    }
    return fishingPoleTweens
}

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
    // Define tweens for the joints of the robot
    //
    const forwardTween = {
        ankle: new TWEEN.Tween({z: rotations.ankle.z}).to({z: ankleConstraints.z[1]}, 1000),
        knee: new TWEEN.Tween({z: rotations.knee.z}).to({z: kneeConstraints.z[1]}, 1000),
        hip: new TWEEN.Tween({z: rotations.hip.z}).to({z: hipConstraints.z[1]}, 1000),
        neck: new TWEEN.Tween({z: rotations.neck.z}).to({z: neckConstraints.z[1]}, 1000),
        shoulder: new TWEEN.Tween({y: rotations.shoulder.y}).to({y: shoulderConstraints.y[1]}, 1000),
    }
    const backwardTween = {
        ankle: new TWEEN.Tween({z: rotations.ankle.z}).to({z: ankleConstraints.z[0]}, 1000),
        knee: new TWEEN.Tween({z: rotations.knee.z}).to({z: kneeConstraints.z[0]}, 1000),
        hip: new TWEEN.Tween({z: rotations.hip.z}).to({z: hipConstraints.z[0]}, 1000),
        neck: new TWEEN.Tween({z: rotations.neck.z}).to({z: neckConstraints.z[0]}, 1000),
        shoulder: new TWEEN.Tween({y: rotations.shoulder.y}).to({y: shoulderConstraints.y[0]}, 1000),
    }
    const leftwardTween = {
        ankle: new TWEEN.Tween({y: rotations.ankle.y}).to({y: ankleConstraints.y[1]}, 1000),
        knee: new TWEEN.Tween({y: rotations.knee.y}).to({y: kneeConstraints.y[1]}, 1000),
        hip: new TWEEN.Tween({y: rotations.hip.y}).to({y: hipConstraints.y[1]}, 1000),
        neck: new TWEEN.Tween({y: rotations.neck.y}).to({y: neckConstraints.y[1]}, 1000),
        shoulder: new TWEEN.Tween({y: rotations.shoulder.y}).to({y: shoulderConstraints.y[1]}, 1000),
    }
    const rightwardTween = {
        ankle: new TWEEN.Tween({y: rotations.ankle.y}).to({y: ankleConstraints.y[0]}, 1000),
        knee: new TWEEN.Tween({y: rotations.knee.y}).to({y: kneeConstraints.y[0]}, 1000),
        hip: new TWEEN.Tween({y: rotations.hip.y}).to({y: hipConstraints.y[0]}, 1000),
        neck: new TWEEN.Tween({y: rotations.neck.y}).to({y: neckConstraints.y[0]}, 1000),
        shoulder: new TWEEN.Tween({y: rotations.shoulder.y}).to({y: shoulderConstraints.y[0]}, 1000),
    }
    const catchTween = {
        forward: new TWEEN.Tween({x: rotations.elbow.x}).to({x: elbowConstraints.x[1]}, 500),
        backward: new TWEEN.Tween({x: rotations.elbow.x}).to({x: elbowConstraints.x[0]}, 800)
    }
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

function initKeyListener(scene, camera, renderer, objects) {
    let robotTweens = initRobotTweens(objects.robot);
    let fishingPoleTweens = initFishingPoleTweens(objects.fishingPole);
    let objectsTweens = {
        robot: robotTweens,
        fishingPole: fishingPoleTweens
    };
    let constraintsReached = {
        forward: {
            ankle: false,
            knee: false,
            hip: false,
            neck: false,
            shoulder: false,
            elbow: true,
            fishLineJoint: true,
        },
        backward: {
            ankle: true,
            knee: true,
            hip: false,
            neck: false,
            shoulder: false,
            elbow: false,
            fishLineJoint: false,
        },
        leftward: {
            ankle: false,
            knee: true,
            hip: true,
            neck: false,
            shoulder: false,
            elbow: false,
            fishLineJoint: false
        },
        rightward: {
            ankle: false,
            knee: true,
            hip: true,
            neck: false,
            shoulder: false,
            elbow: false,
            fishLineJoint: false
        }
    };
    document.onkeydown = function(key) {
        GAME.play(scene, camera, renderer, key, objects, objectsTweens, constraintsReached);
    };
    document.onkeyup = function() {
        Object.keys(objectsTweens.robot.movement).forEach(function(dirTween) {
            Object.keys(objectsTweens.robot.movement[dirTween]).forEach(function(tween) {
                objectsTweens.robot.movement[dirTween][tween].stop();
            });
        });
        Object.keys(objectsTweens.fishingPole).forEach(function(dirTween) {
            Object.keys(objectsTweens.fishingPole[dirTween]).forEach(function(tween) {
                objectsTweens.fishingPole[dirTween][tween].stop();
            });
        });
        objectsTweens.fishingPole = initFishingPoleTweens(objects.fishingPole);
        objectsTweens.robot = initRobotTweens(objects.robot);
    }
    return null
}

function initPlayListener(camera, renderer, cameraControls) {
    document.getElementById("Play_Button").addEventListener("click", function(){ANIMA.startCameraAnimation(camera, renderer)});
    cameraControls.enabled = false;
    return null
}

function initRestartListener(camera, renderer, cameraControls) {
    document.getElementById("Restart_Button").addEventListener("click", function(){ANIMA.startCameraAnimation(camera, renderer)});
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


export {initRenderer, initCamera, initScene, initLights, initCameraControls, initKeyListener, initPlayListener, initRestartListener}
