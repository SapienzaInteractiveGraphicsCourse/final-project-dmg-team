"use_strict"
import * as ANIMA from './animations.js'
import * as INIT from './initialization.js'

// Global variables
let equipped = false;
let fishesTaken = 0;
let points = 0;

function restartPlay(scene, camera, renderer, objects, copiedFishes) {
    points = 0;
    if (fishesTaken > 0) {  // Reload fishes
        for (let i=0; i<objects.fishes.length; i++) {
            scene.remove(scene.getObjectByName(objects.fishes[i].name));
        }
        for (let i=0; i<objects.fishes.length; i++) {
            scene.add(objects.fishes[i]);
        }
    }
    fishesTaken = 0;
    copiedFishes = [...objects.fishes];
    document.getElementById("gameStarted").innerHTML = 'false';
    document.getElementById("End_Menu").style.display = 'block';
    INIT.initRestartListener(camera, renderer);
}

function play(scene, camera, renderer, key, objects, copiedFishes, objectsTweens, constraintsReached) {

    // Get the main objects of the scene
    const robot = objects.robot;
    const fishingPole = objects.fishingPole;
    const originalFishes = objects.fishes;
    const robotTweens = objectsTweens.robot.movement;
    const catchTweens = objectsTweens.robot.catch;
    const fishingPoleTweens = objectsTweens.fishingPole;

    // Select the task
    const gameStarted = document.getElementById("gameStarted").innerHTML;
    if (gameStarted == 'true' && key.code === 'KeyE') {
        ANIMA.equipFishingPoleAnimation(scene, robot, fishingPole);
        equipped = true;
    }
    else if (gameStarted == 'true') {
        switch (key.code) {
            case 'KeyW':
            case 'ArrowUp':
                if (!constraintsReached.forward.ankle) {
                    robotTweens.forward.ankle.start();
                    robotTweens.forward.knee.start();
                    robotTweens.forward.hip.start();
                    robotTweens.forward.neck.start();
                    robotTweens.forward.shoulder.start();
                    fishingPoleTweens.forward.move.start();
                    fishingPoleTweens.forward.scale.start();
                    ANIMA.robotMoveForwardAnimation(robot, robotTweens.forward, constraintsReached);
                    if (equipped)
                        ANIMA.fishingPoleMoveForwardAnimation(fishingPole, fishingPoleTweens.forward, constraintsReached);
                    constraintsReached.backward.ankle = false;
                    constraintsReached.backward.knee = false;
                    constraintsReached.backward.hip = false;
                    constraintsReached.backward.neck = false;
                    constraintsReached.backward.shoulder = false;
                    constraintsReached.backward.fishingPole = false;
                }
                break;
            case 'KeyS':
            case 'ArrowDown':
                robotTweens.backward.ankle.start();
                robotTweens.backward.knee.start();
                robotTweens.backward.hip.start();
                robotTweens.backward.neck.start();
                robotTweens.backward.shoulder.start();
                fishingPoleTweens.backward.move.start();
                fishingPoleTweens.backward.scale.start();
                ANIMA.robotMoveBackwardAnimation(robot, fishingPole, robotTweens.backward, constraintsReached);
                if (equipped)
                    ANIMA.fishingPoleMoveBackwardAnimation(fishingPole, fishingPoleTweens.backward, constraintsReached);
                constraintsReached.forward.ankle = false;
                constraintsReached.forward.knee = false;
                constraintsReached.forward.hip = false;
                constraintsReached.forward.neck = false;
                constraintsReached.forward.shoulder = false;
                constraintsReached.forward.fishingPole = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                if (!constraintsReached.leftward.ankle) {
                    robotTweens.leftward.ankle.start();
                    ANIMA.robotMoveLeftwardAnimation(robot, fishingPole, robotTweens.leftward, constraintsReached);
                    constraintsReached.rightward.ankle = false;
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                if (!constraintsReached.rightward.ankle) {
                    robotTweens.rightward.ankle.start();
                    ANIMA.robotMoveRightwardAnimation(robot, fishingPole, robotTweens.rightward, constraintsReached);
                    constraintsReached.leftward.ankle = false;
                }
                break;
            case 'Space':
                if (equipped) {
                    catchTweens.backward.start();
                    const fish = ANIMA.robotCatchFishAnimation(robot, fishingPole, copiedFishes, catchTweens, constraintsReached);
                    if (fish != null) {
                        scene.remove(scene.getObjectByName(fish.name));
                        for (let i=0; i<copiedFishes.length; i++) {
                            if (copiedFishes[i].name == fish.name) {
                                copiedFishes.splice(i, 1);
                            }
                        }
                        fishesTaken += 1;
                        points += 1;
                        if (fishesTaken == originalFishes.length) {
                            console.log("YOU WIN");
                            document.getElementById("win_div").style.display = 'block';
                            restartPlay(scene, camera, renderer, objects);
                        }
                    }
                    else {
                        points -= 1;
                        if (points == -10) {
                            console.log("YOU LOSE");
                            document.getElementById("lose_div").style.display = 'block';
                            restartPlay(scene, camera, renderer, objects);
                        }
                    }
                    document.getElementById("score").innerHTML = points;
                }
                break;
        }
    }
}


export {play}
