"use strict";
import * as DEF from './definitions.js'
import * as INIT from './initialization.js'
import * as UTILS from './utilities.js'
import TWEEN from './lib/tween.esm.js'


function main(camera, renderer, scene, objects) {
    //
    // Initialization
    //
    const lights = INIT.initLights(scene, DEF.lightsProperties);
    const cameraControls = INIT.initCameraControls(camera, renderer, DEF.cameraProperties.target);
    const playListener = INIT.initPlayListener(camera, renderer, cameraControls);

    //
    // Set the listener for the robot animation
    // 
    const keyListener = INIT.initKeyListener(scene, camera, renderer, objects);

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


export {main}
