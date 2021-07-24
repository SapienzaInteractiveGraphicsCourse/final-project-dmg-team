import TWEEN from './lib/tween.esm.js'
import * as DEF from './definitions.js'
import * as ANIMA from './animations.js'
import * as INIT from './initialization.js'
import * as THREE from '../three.js-master/build/three.module.js';
import { createMesh } from './utilities.js';


// _________________ Camera _________________ //


const newCameraProperties = {
    position: {
        x: 40, 
        y: 20, 
        z: 20
    },
    target: {
        x: 50,
        y: 20,
        z: -10
    }
}
function startCameraAnimation(camera, renderer) {
    const cameraPositionTween = new TWEEN.Tween(camera.position).to(newCameraProperties.position, 3000);
    const cameraTargetTween = new TWEEN.Tween(DEF.cameraProperties.target).to(newCameraProperties.target, 3000);
    const newCameraControls = INIT.initCameraControls(camera, renderer, DEF.cameraProperties.target);
    newCameraControls.enable = false;

    // Position animation
    cameraPositionTween.onUpdate(function(object) {
        camera.position.set(object.x, object.y, object.z);
    })
    cameraPositionTween.start();

    // Rotation animation
    cameraTargetTween.onUpdate(function(object) {
        newCameraControls.target.set(object.x, object.y, object.z);
        newCameraControls.update();
    }).onComplete(() => {
        document.getElementById("gameStarted").innerHTML = 'true';
    });
    cameraTargetTween.start();
}

// _________________ Fishes _________________ //


const waterBoundaries = {
    x: [DEF.fieldProperties.water.position.x - DEF.fieldProperties.water.size.width / 2 + 5,
        DEF.fieldProperties.water.position.x + DEF.fieldProperties.water.size.width / 2 - 5],
    y: [DEF.fieldProperties.water.position.y - DEF.fieldProperties.meshes.boxes.large.size.height / 2 + 5,
        DEF.fieldProperties.water.position.y + DEF.fieldProperties.meshes.boxes.large.size.height / 2 - 10],
    z: [DEF.fieldProperties.water.position.z - DEF.fieldProperties.water.size.height / 2 + 5,
        DEF.fieldProperties.water.position.z + DEF.fieldProperties.water.size.height / 2 - 5]
};
function fishAnimation(fish) {

    // Target definition
    const yIndex = Math.floor(Math.random() * 2);
    const zIndex = Math.floor(Math.random() * 2);
    const fishTarget = {
        x: Math.random() * DEF.fieldProperties.water.size.width + waterBoundaries.x[0],
        y: Math.random() * waterBoundaries.y[yIndex],
        z: Math.random() * waterBoundaries.z[zIndex],
    };
    const duration = 2000 + Math.random() * 8000;
    let tailFlag = true;
    let tailAngle = 0.;

    // Animation
    fish.lookAt(fishTarget.x, fishTarget.y, fishTarget.z);
    const fishTween = new TWEEN.Tween(fish.position).to(fishTarget, duration);
    fishTween.onUpdate(function(object) {
        // Movement animation
        fish.position.set(object.x, object.y, object.z);
        // Tail animation
        if (tailFlag) {
            fish.rotation.y += 0.04;
            tailAngle += 0.04;
        } else {
            fish.rotation.y -= 0.04;
            tailAngle -= 0.04;
        }
        if (tailAngle > 0.17) tailFlag = false;
        if (tailAngle < -0.17) tailFlag = true;
    }).onComplete(() => {fishAnimation(fish);});
    fishTween.easing(TWEEN.Easing.Quadratic.Out);
    fishTween.start();

    return fishTarget
}

// __________________ Robot __________________ //


function equipFishingPoleAnimation(scene, robot, fishingPole) {
    fishingPole.position.set(0, DEF.fishingPoleProperties.pole.size.height / 2, 0);
    fishingPole.rotation.set(0, - Math.PI / 2, 0);
    robot.traverse(function(child) {
        if (child.isMesh) {
            if (child.name == 'actuator') {
                child.add(fishingPole);
            }
        }
    }); 
    fishingPole.traverse(function(child) {
        if (child.name == 'fishLineJoint') {
            child.rotation.z = Math.PI / 2;
        }
    });
}

function rotateChild(robot, axis, name, rotationObject) {
    robot.traverse(function(child) {
        if (child.name == name) {
            if (axis =='x') 
                child.rotation.x = rotationObject.x
            else if (axis == 'y')
                child.rotation.y = rotationObject.y
            else if (axis == 'z')
                child.rotation.z = rotationObject.z
        }
    });
}

function moveForwardAnimation(robot, forwardTweens, constraintsReached) {
    const forwardTween = forwardTweens.ankle;
    forwardTween.onUpdate(function(object) {
        rotateChild(robot, 'z', 'joint_ankle', object);
    }).onComplete(() => {constraintsReached.forward.ankle = true;});
    return forwardTween
}

function moveBackwardAnimation(robot, backwardTweens, constraintsReached) {
    const backwardTween = backwardTweens.ankle;
    backwardTween.onUpdate(function(object) {
        rotateChild(robot, 'z', 'joint_ankle', object);
    }).onComplete(() => {constraintsReached.backward.ankle = true;});
    return backwardTween
}

function moveLeftwardAnimation(robot, leftwardTweens, constraintsReached) {
    const leftwardTween = leftwardTweens.ankle;
    leftwardTween.onUpdate(function(object) {
        rotateChild(robot, 'y', 'joint_ankle', object);
    }).onComplete(() => {constraintsReached.leftward.ankle = true;});
    return leftwardTween
}

function moveRightwardAnimation(robot, rightwardTweens, constraintsReached) {
    const rightwardTween = rightwardTweens.ankle;
    rightwardTween.onUpdate(function(object) {
        rotateChild(robot, 'y', 'joint_ankle', object);
    }).onComplete(() => {constraintsReached.rightward.ankle = true;});
    return rightwardTween
}


export {startCameraAnimation, 
        fishAnimation, 
        equipFishingPoleAnimation,
        moveForwardAnimation, moveBackwardAnimation, moveLeftwardAnimation, moveRightwardAnimation}
