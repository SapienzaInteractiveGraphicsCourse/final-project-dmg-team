"use strict";
import * as DEF from './definitions.js'
import * as DRAW from './draw.js'
import * as INIT from './initialization.js'
import * as UTILS from './utilities.js'
import TWEEN from './lib/tween.esm.js'


function main() {
    //
    // Initialization
    //
    const renderer = INIT.initRenderer();
    const camera = INIT.initCamera(DEF.cameraProperties);
    const scene = INIT.initScene(DEF.sceneProperties);
    const lights = INIT.initLights(scene, DEF.lightsProperties);
    const cameraControls = INIT.initCameraControls(camera, renderer, DEF.cameraProperties.target);
    const playListener = INIT.initPlayListener(camera, renderer, cameraControls);

    //
    // Meshes drawing
    //
    const benches = DRAW.drawBenches(scene, DEF.benchesProperties);
    const trees = DRAW.drawTrees(scene, DEF.treesProperties);
    const fishes = DRAW.drawFishes(scene, DEF.fishesProperties);
    const field = DRAW.drawField(scene, DEF.fieldProperties);
    const sun = DRAW.drawSun(scene, DEF.sunProperties);
    const robot = DRAW.drawRobot(scene, DEF.robotProperties);
    const fishingPole = DRAW.drawFishingPole(scene, DEF.fishingPoleProperties); 
    const nature = DRAW.drawNature(scene, DEF.natureProperties);

    //
    // Struct with the main objects
    //
    const objects = {
        robot: robot,
        fishingPole: fishingPole,
        fishes: fishes
    };

    //
    // Set the listener for the robot animation
    // 
    const keyListener = INIT.initKeyListener(scene, objects);

    //
    // Render
    //
    function render(time) {
        //
        // Convert time to seconds
        //
        time *= 0.001;
    
        if (UTILS.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    
        renderer.render(scene, camera);
        TWEEN.update();
    
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();