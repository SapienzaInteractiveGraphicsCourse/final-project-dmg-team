"use strict";
import * as UTILS from './utilities.js'
import * as THREE from '../three.js-master/build/three.module.js';
import * as ANIMA from './animations.js'
import {Water} from '../three.js-master/examples/jsm/objects/Water2.js';


function drawTrees(scene, treesProperties) {                // FIND A WAY TO MAKE INSTANCES INSTEAD OF CREATE DIFFERENT OBJECTS
    const trees = [];
    treesProperties.forEach(treeProperties => {
        const tree = UTILS.createObject(treeProperties);
        trees.push(tree);
        scene.add(tree);
    });
    return trees
}

function drawBenches(scene, benchesProperties) {
    const benches = [];
    benchesProperties.forEach(benchProperties => {
        const bench = UTILS.createObject(benchProperties);
        benches.push(bench);
        scene.add(bench);
    });
    return benches
}

function drawRocks(scene, rocksProperties) {
    const rocks = [];
    rocksProperties.forEach(rockProperties => {
        const rock = UTILS.createObject(rockProperties);
        rocks.push(rock);
        scene.add(rock);
    });
    return rocks
}

function drawFishes(scene, fishesProperties) {
    const fishes = [];
    fishesProperties.forEach(fishProperties => {
        const fish = UTILS.createObject(fishProperties);
        fishes.push(fish);
        scene.add(fish);
        ANIMA.fishAnimation(fish, fishProperties);
    });
    return fishes
}
    
function drawRobot(scene, robotProperties) {

    // Define main properties
    const robot = new THREE.Group();
    const robotModules = [];
    const globalProperties = [
        robotProperties.parts.base,
        robotProperties.joints.body.ankle,
        robotProperties.parts.leg.low,
        robotProperties.joints.body.knee,
        robotProperties.parts.leg.high,
        robotProperties.joints.body.hip,
        robotProperties.parts.bust,
        robotProperties.joints.body.neck,
        robotProperties.joints.arm.shoulder,
        robotProperties.parts.arm.low,
        robotProperties.joints.arm.elbow,
        robotProperties.parts.arm.high,
        robotProperties.parts.arm.actuator,
        robotProperties.parts.head.skull,
        robotProperties.parts.head.eyes.left,
        robotProperties.parts.head.eyes.right,
    ];
    const eyeLightProperties = robotProperties.parts.head.eyes.eyeLight;

    // Create the mesh of each part
    globalProperties.forEach(partProperties => {
        const partMesh = UTILS.createMesh(partProperties, 'phong');
        partMesh.name = partProperties.name;
        robotModules.push(partMesh);
    });
    const baseMesh = robotModules[0];
    const ankleMesh = robotModules[1];
    const lowLegMesh = robotModules[2];
    const kneeMesh = robotModules[3];
    const highLegMesh = robotModules[4];
    const hipMesh = robotModules[5];
    const bustMesh = robotModules[6];
    const neckMesh = robotModules[7];
    const shoulderMesh = robotModules[8];
    const lowArmMesh = robotModules[9];
    const elbowMesh = robotModules[10];
    const highArmMesh = robotModules[11];
    const actuatorMesh = robotModules[12];
    const headMesh = robotModules[13];
    const leftEyeMesh = robotModules[14];
    const rightEyeMesh = robotModules[15];

    // Create robot lights
    const leftEyeLight = new THREE.PointLight(
        eyeLightProperties.color,
        eyeLightProperties.intensity,
        eyeLightProperties.distance
    );
    leftEyeLight.position.set(
        eyeLightProperties.position.x, 
        eyeLightProperties.position.y, 
        eyeLightProperties.position.z
    );
    const rightEyeLight = new THREE.PointLight(
        eyeLightProperties.color,
        eyeLightProperties.intensity,
        eyeLightProperties.distance
    );
    rightEyeLight.position.set(
        eyeLightProperties.position.x, 
        eyeLightProperties.position.y, 
        eyeLightProperties.position.z
    );

    /* Create the hierarchical model */
    //
    // Head hierarchy
    leftEyeMesh.add(leftEyeLight);
    rightEyeMesh.add(rightEyeLight);
    headMesh.add(leftEyeMesh, rightEyeMesh);
    //
    // Arm Hierarchy
    shoulderMesh.add(lowArmMesh);
    lowArmMesh.add(elbowMesh);
    elbowMesh.add(highArmMesh);
    highArmMesh.add(actuatorMesh);
    //
    // Body hierarchy
    neckMesh.add(headMesh);
    bustMesh.add(neckMesh, shoulderMesh);
    hipMesh.add(bustMesh);
    highLegMesh.add(hipMesh);
    kneeMesh.add(highLegMesh);
    lowLegMesh.add(kneeMesh);
    ankleMesh.add(lowLegMesh);
    baseMesh.add(ankleMesh);    
    robot.add(baseMesh);

    // Set robot position (sit on the bench)
    robot.position.set(
        robotProperties.position.x,
        robotProperties.position.y,
        robotProperties.position.z
    );
    
    scene.add(robot);
    return robot
}

function drawFishingPole(scene, fishingPoleProperties) {

    // Create the meshes
    const fishingPole = new THREE.Group();
    const poleMesh = UTILS.createMesh(fishingPoleProperties.pole);
    const reelMesh = UTILS.createMesh(fishingPoleProperties.reel);
    const floatingMesh = UTILS.createMesh(fishingPoleProperties.floating);
    const fishLineMainMesh = UTILS.createMesh(fishingPoleProperties.fishline.main);
    const fishLineTerminalMesh = UTILS.createMesh(fishingPoleProperties.fishline.terminal);
    const rodHolder = UTILS.createMesh(fishingPoleProperties.rodHolder);

    // Rotation point of the fishLine
    const lineJoint = new THREE.Object3D();
    lineJoint.name = 'fishLineJoint';
    lineJoint.position.set(0, fishingPoleProperties.pole.size.height / 2, 0);

    floatingMesh.add(fishLineTerminalMesh);
    fishLineMainMesh.add(floatingMesh);
    lineJoint.add(fishLineMainMesh);
    poleMesh.add(lineJoint, reelMesh);
    fishingPole.add(poleMesh);

    // Adjust the rotation axis
    lineJoint.rotation.z = Math.PI / 4;

    // Set final position and rotation
    fishingPole.position.set(
        fishingPoleProperties.position.x,
        fishingPoleProperties.position.y,
        fishingPoleProperties.position.z
    );
    fishingPole.rotation.set(
        fishingPoleProperties.rotation.x,
        fishingPoleProperties.rotation.y,
        fishingPoleProperties.rotation.z
    );

    scene.add(fishingPole, rodHolder);
    return fishingPole
}

function drawSun(scene, sunProperties) {
    const sun = UTILS.createMesh(sunProperties, 'basic');
    scene.add(sun);
    return sun
}

function drawWater(scene, waterProperties) {
    const waterGeometry = UTILS.createGeometry(waterProperties.type, waterProperties.size);
    const water = new Water(waterGeometry, {
        color: waterProperties.color,
        scale: waterProperties.scale,
        flowSpeed: waterProperties.flowSpeed,
        flowDirection: new THREE.Vector2(
            waterProperties.flow.x, waterProperties.flow.y),
        textureWidth: waterProperties.texture.width,
        textureHeight: waterProperties.texture.height
    });
    water.position.set(
        waterProperties.position.x,
        waterProperties.position.y,
        waterProperties.position.z
    );
    water.rotation.x = waterProperties.rotation.x;
    scene.add(water);
    return water
}

function drawField(scene, fieldProperties) {
    const field = new THREE.Object3D();
    const largeboxMesh = UTILS.createMesh(
        fieldProperties.meshes.boxes.large, null);
    const smallboxMesh1 = UTILS.createMesh(
        fieldProperties.meshes.boxes.small[0], null);
    const smallboxMesh2 = UTILS.createMesh(
        fieldProperties.meshes.boxes.small[1], null);
    const largeplaneMesh = UTILS.createMesh(fieldProperties.meshes.planes.large);
    const smallplaneMesh = UTILS.createMesh(fieldProperties.meshes.planes.small);

    largeplaneMesh.material.side = THREE.DoubleSide;
    smallplaneMesh.material.side = THREE.DoubleSide;

    const water = drawWater(scene, fieldProperties.water);

    field.add(largeboxMesh, smallboxMesh1, smallboxMesh2, largeplaneMesh, smallplaneMesh, water);
    scene.add(field);

    return {
        field: field,
        water: water
    }
}

function drawNature(scene, natureProperties) {
    const rocks = drawRocks(scene, natureProperties.rocks);
    return {
        rocks: rocks
    }
}


export {drawTrees, drawBenches, drawFishes, drawSun, drawWater, drawField, drawNature, 
        drawRobot, drawFishingPole};