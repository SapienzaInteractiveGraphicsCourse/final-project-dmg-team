"use_strict"
import * as ANIMA from './animations.js'
import * as THREE from '../three.js-master/build/three.module.js';
import * as DEF from './definitions.js'


function play(scene, key, objects, robotTweens, constraintsReached) {

    // Get the main objects of the scene
    const robot = objects.robot;
    const fishingPole = objects.fishingPole;
    const fishes = objects.fishes;

    // Select the task
    const gameStarted = document.getElementById("gameStarted").innerHTML;
    if (gameStarted == 'true' && key.code === 'KeyE') {
        ANIMA.equipFishingPoleAnimation(scene, robot, fishingPole);
    }
    else if (gameStarted == 'true') {
        switch (key.code) {
            case 'KeyW':
            case 'ArrowUp':
                if (!constraintsReached.forward.ankle) {
                    robotTweens.forward.ankle.start();
                    ANIMA.moveForwardAnimation(robot, robotTweens.forward, constraintsReached);
                    constraintsReached.backward.ankle = false;
                }
                break;
            case 'KeyS':
            case 'ArrowDown':
                if (!constraintsReached.backward.ankle) {
                    robotTweens.backward.ankle.start();
                    ANIMA.moveBackwardAnimation(robot, robotTweens.backward, constraintsReached);
                    constraintsReached.forward.ankle = false;
                }
                break;
            case 'KeyA':
            case 'ArrowLeft':
                if (!constraintsReached.leftward.ankle) {
                    robotTweens.leftward.ankle.start();
                    ANIMA.moveLeftwardAnimation(robot, robotTweens.leftward, constraintsReached);
                    constraintsReached.rightward.ankle = false;
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                if (!constraintsReached.rightward.ankle) {
                    robotTweens.rightward.ankle.start();
                    ANIMA.moveRightwardAnimation(robot, robotTweens.rightward, constraintsReached);
                    constraintsReached.leftward.ankle = false;
                }
                break;           
        }
    }
}


export {play}