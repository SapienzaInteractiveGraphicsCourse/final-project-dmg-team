import TWEEN from './lib/tween.esm.js'
import * as DEF from './definitions.js'
import * as INIT from './initialization.js'
import * as THREE from './lib/three.js-master/build/three.module.js';


// _________________ Generic _________________ //


function rotateChild(object, axis, name, rotationObject) {
    object.traverse(function(child) {
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

function scaleChild(object, axis, name, scaleObject, original_lenght=null, child_to_unscale=null) {
    object.traverse(function(child) {
        if (child.name == name) {
            if (axis == 'x') {
                child.scale.x = scaleObject.x;
                child.position.x = child.position.x*(1 - scaleObject.x);
            }
            else if (axis == 'y') {             
                child.scale.y = scaleObject.y;
                child.position.set(0, 0, 0);
                child.position.y -= original_lenght*scaleObject.y / 2;
            }
            else if (axis == 'z') {
                child.scale.z = scaleObject.z;
                child.position.z = child.position.z*(1 - scaleObject.z);
            }
            if (child_to_unscale != null) {
                child.traverse(function(nephew) {
                    if (nephew.name == child_to_unscale) {
                        if (axis == 'x')
                            nephew.scale.x = 1/scaleObject.x
                        else if (axis == 'y')
                            nephew.scale.y = 1/scaleObject.y
                        else if (axis == 'z')
                            nephew.scale.z = 1/scaleObject.z
                    }
                });
            }
        }
    });
}

function checkBorder(fishingPole, waterProperties, side=null) {
    let borderReached = false;
    let jointPosition = new THREE.Vector3();
    fishingPole.traverse(function(child) {
        if (child.name == 'fishLineJoint')
            child.getWorldPosition(jointPosition);
    });
    const borderPosition = waterProperties.position.x - waterProperties.size.width / 2;

    const backCondition = jointPosition.x < borderPosition + 10;
    if (side == null) {
        if (backCondition) borderReached = true;
    }
    else if (side == 'left') {
        if (backCondition && (jointPosition.z < 0)) {
            borderReached = true;
        }
    }
    else if (side == 'right') {
        if (backCondition && (jointPosition.z > 0)) borderReached = true;
    }
    return borderReached
}

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
    document.getElementById("End_Menu").style.display = 'none';
    document.getElementById("lose_div").style.display = 'none';
    document.getElementById("win_div").style.display = 'none';
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

// ______________ Fishing Pole ______________ //


function fishingPoleMoveForwardAnimation(fishingPole, forwardTweens, constraintsReached) {
    const fishLineLenght = DEF.fishingPoleProperties.fishline.main.size.height;
    // Move
    forwardTweens.move.onUpdate(function(object) {
        if (!constraintsReached.forward.fishingPole)
            rotateChild(fishingPole, 'z', 'fishLineJoint', object);
    }).onComplete(() => {constraintsReached.forward.fishingPole = true;});
    // Scale
    forwardTweens.scale.onUpdate(function(object) {
        if (!constraintsReached.forward.fishingPole)
            scaleChild(fishingPole, 'y', 'fishLineMain', object, fishLineLenght, 'floating');
    }).onComplete(() => {constraintsReached.forward.fishingPole = true;});
}
function fishingPoleMoveBackwardAnimation(fishingPole, backwardTweens, constraintsReached) {
    const fishLineLenght = DEF.fishingPoleProperties.fishline.main.size.height;
    // Move
    backwardTweens.move.onUpdate(function(object) {
        if (!constraintsReached.backward.fishingPole)
            rotateChild(fishingPole, 'z', 'fishLineJoint', object);
    }).onComplete(() => {constraintsReached.backward.fishingPole = true;});
    // Scale
    backwardTweens.scale.onUpdate(function(object) {
        if (!constraintsReached.backward.fishingPole)
            scaleChild(fishingPole, 'y', 'fishLineMain', object, fishLineLenght, 'floating');
    }).onComplete(() => {constraintsReached.backward.fishingPole = true;});
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

function robotCatchFishAnimation(robot, fishingPole, fishes, catchTweens, constraintsReached) {
    let fishCatched;
    let floatingPosition = new THREE.Vector3();
    fishingPole.traverse(function(child) {
        if (child.name == 'floating')
            child.getWorldPosition(floatingPosition);
    });

    catchTweens.backward.onUpdate(function(object) {
        rotateChild(robot, 'x', 'joint_elbow', object);
    }).onComplete(() => {
        catchTweens.forward.start();
        catchTweens.forward.onUpdate(function(object) {
            rotateChild(robot, 'x', 'joint_elbow', object);
        });
    });

    let taken = false;
    fishes.forEach(fish => {
        if (Math.abs(fish.position.x - floatingPosition.x) < 8 &&
            Math.abs(fish.position.z - floatingPosition.z) < 8) {
                taken = true;
                console.log("GOOD JOB! FISH TAKEN +1 points");
                fishCatched = fish;
            }
    });

    if (!taken) {
        fishCatched = null;
        console.log("BAD CATCH. -1 points");
    }
        
    return fishCatched
}

function robotMoveForwardAnimation(robot, forwardTweens, constraintsReached) {
    // Main movement 
    forwardTweens.ankle.onUpdate(function(object) {
        rotateChild(robot, 'z', 'joint_ankle', object);
    }).onComplete(() => {constraintsReached.forward.ankle = true;});

    // Secondary movements
    forwardTweens.knee.onUpdate(function(object) {
        if (!constraintsReached.forward.knee)
            rotateChild(robot, 'z', 'joint_knee', object);
    }).onComplete(() => {constraintsReached.forward.knee = true;});
    forwardTweens.hip.onUpdate(function(object) {
        if (!constraintsReached.forward.hip)
            rotateChild(robot, 'z', 'joint_hip', object);
    }).onComplete(() => {constraintsReached.forward.hip = true;});
    forwardTweens.neck.onUpdate(function(object) {
        if (!constraintsReached.forward.neck)
            rotateChild(robot, 'z', 'joint_neck', object);
    }).onComplete(() => {constraintsReached.forward.neck = true;});
    forwardTweens.shoulder.onUpdate(function(object) {
        if (!constraintsReached.forward.shoulder)
            rotateChild(robot, 'y', 'joint_shoulder', object);
    }).onComplete(() => {constraintsReached.forward.shoulder = true;});

    return forwardTweens
}

function robotMoveBackwardAnimation(robot, fishingPole, backwardTweens, constraintsReached) {
    // Check if the border has been reached
    const borderReached = checkBorder(fishingPole, DEF.fieldProperties.water);

    if (!borderReached) {
        // Main movement
        backwardTweens.ankle.onUpdate(function(object) {
            if (!constraintsReached.backward.ankle)
                rotateChild(robot, 'z', 'joint_ankle', object);
        }).onComplete(() => {constraintsReached.backward.ankle = true;});

        // Secondary movement
        backwardTweens.knee.onUpdate(function(object) {
            if (!constraintsReached.backward.knee)
                rotateChild(robot, 'z', 'joint_knee', object);
        }).onComplete(() => {constraintsReached.backward.knee = true;});
        backwardTweens.hip.onUpdate(function(object) {
            if (!constraintsReached.backward.hip)
                rotateChild(robot, 'z', 'joint_hip', object);
        }).onComplete(() => {constraintsReached.backward.hip = true;});
        backwardTweens.neck.onUpdate(function(object) {
            if (!constraintsReached.backward.neck)
                rotateChild(robot, 'z', 'joint_neck', object);
        }).onComplete(() => {constraintsReached.backward.neck = true;});
        backwardTweens.shoulder.onUpdate(function(object) {
            if (!constraintsReached.backward.shoulder)
                rotateChild(robot, 'y', 'joint_shoulder', object);
        }).onComplete(() => {constraintsReached.backward.shoulder = true;});
    }

    return backwardTweens
}

function robotMoveLeftwardAnimation(robot, fishingPole, leftwardTweens, constraintsReached) {
    const leftwardTween = leftwardTweens.ankle;
    leftwardTween.onUpdate(function(object) {
        const borderReached = checkBorder(fishingPole, DEF.fieldProperties.water, 'left');
        if (!borderReached)
            rotateChild(robot, 'y', 'joint_ankle', object);
    }).onComplete(() => {constraintsReached.leftward.ankle = true;});
    return leftwardTween
}

function robotMoveRightwardAnimation(robot, fishingPole, rightwardTweens, constraintsReached) {
    const rightwardTween = rightwardTweens.ankle;
    rightwardTween.onUpdate(function(object) {
        const borderReached = checkBorder(fishingPole, DEF.fieldProperties.water, 'right');
        if (!borderReached)
            rotateChild(robot, 'y', 'joint_ankle', object);
    }).onComplete(() => {constraintsReached.rightward.ankle = true;});
    return rightwardTween
}


export {startCameraAnimation, 
        fishAnimation, 
        equipFishingPoleAnimation,
        fishingPoleMoveForwardAnimation, fishingPoleMoveBackwardAnimation,
        robotCatchFishAnimation, robotMoveForwardAnimation, robotMoveBackwardAnimation, robotMoveLeftwardAnimation, robotMoveRightwardAnimation}
