/* ----------------------------------------- Constants ----------------------------------------- */
//
// Here are some common values shared between more elements of the program
//
const shadowsOn = true;
const skyColor = 0x86f7f7;
const groundThickness = 20;
const groundColor = 0xbfea4f;

/* ---------------------------------------- Properties ---------------------------------------- */
//
// Properties of all elements in the program
//


/* ------------------ Scene ------------------ */

const sceneProperties = {
    backgroundColor: skyColor
};

/* ----------------- Viewing ----------------- */

const cameraProperties = {
    fov: 75,
    aspect: 2,
    near: 0.1,
    far: 1000,
    position: {
        x: 108, 
        y: 15, 
        z: 115
    },
    target: {
        x: 30,
        y: 20,
        z: -10
    }
};

/* ----------------- Lights ----------------- */

const sunProperties = {
    texture: {
        color: 0xfffcb9,
        map: null
    },
    size: {
        radius: 2,
        widthDivisions: 32,
        heightDivisions: 16
    },
    position: {
        x: -65, 
        y: 150, 
        z: 75
    },
    rotation: {
        x: 0, 
        y: 0, 
        z: 0
    },
    shadows: {
        cast: false,
        receive: false
    },
    type: 'sphere'
};

const lightsProperties = {
    directional: { 
        color: 0xfffddc,
        intensity: 0.6,
        position: sunProperties.position,
        helper: false,
        shadows: {
            cast: true,
            receive: false,
            mapWidth: 2048,
            mapHeight: 2048,
            cameraSide: 300,
            cameraNear: 0.5, 
            cameraFar: 350
        }
    },
    ambient: {
        color: 0xffffff,
        intensity: 0.3,
        position: {
            x: 0, 
            y: 0, 
            z: 0
        },
        shadows: {
            cast: false, 
            receive: false
        }
    },
    hemisphere: {
        skyColor: skyColor,
        groundColor: groundColor,
        intensity: 0.1,
        position: sunProperties.position,
        shadows: {
            cast: false, 
            receive: false
        }
    }
};

/* ------------------ Field ------------------ */

const fieldMap = "./js/lib/three.js-master/examples/textures/terrain/grasslight-big.jpg";
const fieldNormalMap = "./js/lib/three.js-master/examples/textures/terrain/grasslight-big-nm.jpg";
const fieldProperties = {
    meshes: {
        boxes: {
            large: {
                size: {
                    width: 300, 
                    height: groundThickness, 
                    depth: 300
                },
                position: {
                    x: -100, 
                    y: 0, 
                    z: 0
                },
                rotation: {
                    x: 0, 
                    y: 0, 
                    z: 0
                },
                texture: {
                    color: groundColor,
                    map: fieldMap,
                    normalMap: fieldNormalMap,
                    repeat: {
                        x: 10,
                        y: 10
                    },
                    anisotropy: 16
                },
                shadows: {cast: false, receive: true},
                type: 'box'
            },
            small: [
                { // 1st mesh
                    size: {
                        width: 200, 
                        height: groundThickness, 
                        depth: 50
                    },
                    position: {
                        x: 150, 
                        y: 0, 
                        z: 125
                    },
                    rotation: {
                        x: 0, 
                        y: 0, 
                        z: 0
                    },
                    texture: {
                        color: groundColor,
                        map: fieldMap,
                        normalMap: fieldNormalMap,
                        repeat: {
                            x: 4,
                            y: 3
                        },
                        anisotropy: 16
                    },
                    shadows: {
                        cast: false, 
                        receive: true
                    },
                    type: 'box'
                },
                { // 2nd mesh
                    size: {
                        width: 200,
                        height: groundThickness,
                        depth: 50
                    },
                    position: {
                        x: 150,
                        y: 0,
                        z: -125
                    },
                    rotation: {
                        x: 0, 
                        y: 0, 
                        z: 0
                    },
                    texture: {
                        color: groundColor,
                        map: fieldMap,
                        normalMap: fieldNormalMap,
                        repeat: {
                            x: 4,
                            y: 3
                        },
                        anisotropy: 16
                    },
                    shadows: {
                        cast: false,
                        receive: true
                    },
                    type: 'box'
                }
            ]
        },
        planes: {
            large: {
                size: {
                    width: 200,
                    height: 200
                },
                position: {
                    x: 150,
                    y: -groundThickness / 2,
                    z: 0
                },
                rotation: {
                    x: Math.PI * - 0.5, 
                    y: 0, 
                    z: 0
                },
                texture: {
                    color: 0x17dea3,
                    map: null,
                },
                shadows: {
                    cast: false,
                    receive: true
                },
                type: 'plane'
            },
            small: {
                size: {
                    width: 200,
                    height: groundThickness,
                },
                position: {
                    x: 250,
                    y: 0,
                    z: 0
                },
                rotation: {
                    x: 0, 
                    y: Math.PI * - 0.5, 
                    z: 0
                },
                texture: {
                    color: 0x17dea3,
                    map: null,
                },
                shadows: {
                    cast: false,
                    receive: true
                },
                type: 'plane'
            }
        }
    },
    water: {
        position: {
            x: 150,
            y: groundThickness / 2 - 1,
            z: 0
        },
        rotation: {
            x: Math.PI * - 0.5,
            y: 0,
            z: 0
        },
        flow: {
            x: 0.1,
            y: 0.1
        },
        size: {
            width: 200,
            height: 200,
        },
        shadows: {
            cast: false,
            receive: true
        },
        texture: {
            width: 1024,
            height: 1024
        },
        color: 0x00afb9,
        flowSpeed: 0,
        scale: 1,
        type: 'plane'
    },
    texture: {
        image: fieldMap,
        normalMap: fieldNormalMap
    }
}

/* ------------------ Trees ------------------ */

const trees1Path = {
    mtl: './objects/trees/Voxel_Tree_1.mtl',
    obj: './objects/trees/Voxel_Tree_1.obj'
};
const trees2Path = {
    mtl: './objects/trees/Voxel_Tree_2.mtl',
    obj: './objects/trees/Voxel_Tree_2.obj'
};
const treesProperties = [
    {
        position: {x: 10, y: groundThickness / 2, z: -10},
        rotation: {x: 0, y: 0, z: 0},
        shadows: {cast: true, receive: true},
        path: trees1Path
    },
    {
        position: {x: 60, y: groundThickness / 2, z: -110},
        rotation: {x: 0, y: Math.PI/2, z: 0},
        shadows: {cast: true, receive: true},
        path: trees1Path
    },
    {
        position: {x: 130, y: groundThickness / 2, z: -110},
        rotation: {x: 0, y: Math.PI, z: 0},
        shadows: {cast: true, receive: true},
        path: trees1Path
    },
    {
        position: {x: 210, y: groundThickness / 2, z: -110},
        rotation: {x: 0, y: 3*Math.PI/2, z: 0},
        shadows: {cast: true, receive: true},
        path: trees1Path
    },
    {
        position: {x: 60, y: groundThickness / 2, z: 110},
        rotation: {x: 0, y: Math.PI/2, z: 0},
        shadows: {cast: true, receive: true},
        path: trees1Path
    },
    {
        position: {x: 130, y: groundThickness / 2, z: 110},
        rotation: {x: 0, y: 3*Math.PI/2, z: 0},
        shadows: {cast: true, receive: true},
        path: trees1Path
    },
    {
        position: {x: 210, y: groundThickness / 2, z: 110},
        rotation: {x: 0, y: Math.PI/2, z: 0},
        shadows: {cast: true, receive: true},
        path: trees1Path
    }
];

/* ----------------- Benches ----------------- */

const benchPath = {
    mtl: './objects/benches/bench.mtl',
    obj: './objects/benches/bench.obj'
};
const benchesProperties = [
    {
        position: {x: 25, y: groundThickness / 2, z: -10},
        rotation: {x: 0, y: Math.PI * 0.5, z: 0},
        shadows: {cast: true, receive: true},
        path: benchPath
    },
    {
        position: {x: 95, y: groundThickness / 2, z: -110},
        rotation: {x: 0, y: 0, z: 0},
        shadows: {cast: true, receive: true},
        path: benchPath
    },
    {
        position: {x: 170, y: groundThickness / 2, z: -110},
        rotation: {x: 0, y: 0, z: 0},
        shadows: {cast: true, receive: true},
        path: benchPath
    },
    {
        position: {x: 95, y: groundThickness / 2, z: 110},
        rotation: {x: 0, y: Math.PI, z: 0},
        shadows: {cast: true, receive: true},
        path: benchPath
    },
    {
        position: {x: 170, y: groundThickness / 2, z: 110},
        rotation: {x: 0, y: Math.PI, z: 0},
        shadows: {cast: true, receive: true},
        path: benchPath
    },
];

/* ----------------- Fishes ----------------- */

const fishPath = {
    mtl: './objects/fishes/fish.mtl',
    obj: './objects/fishes/fish.obj'
};
const fishesProperties = [
    {
        position: {x: 60, y: 0, z: 5},
        rotation: {x: 0, y: 0.5, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 95, y: 0, z: -15},
        rotation: {x: 0, y: 0, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 170, y: 0, z: -20},
        rotation: {x: 0, y: 0.4, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 95, y: 0, z: 10},
        rotation: {x: 0, y: 1.5, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 170, y: 0, z: 50},
        rotation: {x: 0, y: 2.1, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 180, y: 0, z: 11},
        rotation: {x: 0, y: 2.2, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 170, y: 0, z: 20},
        rotation: {x: 0, y: 0.2, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 60, y: 0, z: 20},
        rotation: {x: 0, y: 1.0, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 200, y: 0, z: -20},
        rotation: {x: 0, y: 0.4, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 230, y: 0, z: -30},
        rotation: {x: 0, y: 1.5, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 190, y: 0, z: 12},
        rotation: {x: 0, y: 2.1, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 210, y: 0, z: -21},
        rotation: {x: 0, y: 2.2, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 150, y: 0, z: 30},
        rotation: {x: 0, y: 0.2, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    },
    {
        position: {x: 100, y: 0, z: 0},
        rotation: {x: 0, y: 1.0, z: 0},
        shadows: {cast: true, receive: true},
        path: fishPath
    }

];

/* ------------------ Robot ------------------ */

// General
const metalColor = 0xf1f1f1;
const robotColor = 0x51bbf7;
const robotPosition = {
    x: 28,
    y: groundThickness / 2,
    z: benchesProperties[0].position.z
};

// Base
const baseHeight = 1.5;
const baseProperties = {
    size: {
        width: baseHeight * 2,
        height: baseHeight,
        depth: baseHeight * 2
    },
    position: {
        x: 0,
        y: baseHeight / 2,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    texture: {
        color: robotColor,
        map: null
    },
    shadows: {
        cast: true,
        receive: true
    },
    name: 'base',
    type: 'box'
};

// Leg
const legHeight = 2;
const legProperties = {
    low: {
        size: {
            width: 2 * legHeight / 3,
            height: legHeight,
            depth: 2 * legHeight / 3
        },
        position: {
            x: 0,
            y: baseHeight / 2 + legHeight / 2,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        texture: {
            color: robotColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'bustLow',
        type: 'box'
    },
    high: {
        size: {
            width: 2 * legHeight / 3,
            height: 3 * legHeight / 2,
            depth: 2 * legHeight / 3
        },
        position: {
            x: 0,
            y: 3 * legHeight / 4,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        texture: {
            color: robotColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'bustLow',
        type: 'box'
    }
};

// Bust
const bustHeight = 4;
const bustProperties = {
    size: {
        width: bustHeight / 3,
        height: bustHeight,
        depth: bustHeight / 3
    },
    position: {
        x: 0,
        y: bustHeight / 2,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    texture: {
        color: robotColor,
        map: null
    },
    shadows: {
        cast: true,
        receive: true
    },
    name: 'bustHigh',
    type: 'box'
};

// Head
const headHeight = 3;
const eyeSide = 0.3;
const eyeColor = 0x0028ff;
const headProperties = {
    skull: {
        size: {
            width: headHeight,
            height: headHeight,
            depth: headHeight
        },
        position: {
            x: 0,
            y: headHeight / 3,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        texture: {
            color: robotColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'head',
        type: 'box'
    },
    eyes: {
        left: {
            size: {
                width: eyeSide,
                height: eyeSide,
                depth: eyeSide * 2
            },
            position: {
                x: headHeight / 2,
                y: headHeight / 4,
                z: -0.6
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            texture: {
                color: eyeColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: false
            },
            name: 'leftEye',
            type: 'box'
        },
        right: {
            size: {
                width: eyeSide,
                height: eyeSide,
                depth: eyeSide * 2
            },
            position: {
                x: headHeight / 2,
                y: headHeight / 4,
                z: 0.6
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            texture: {
                color: eyeColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: false
            },
            name: 'leftEye',
            type: 'box'
        },
        eyeLight: {
            color: 0xffffff,
            intensity: 1,
            distance: 4,
            position: {x: eyeSide, y: 0, z: 0},
            helper: false,
            shadows: {
                cast: false,
                receive: false,
            }
        }
    }
};

// Arm
const armRadius = 0.5;
const armLenght = 2.2;
const actuatorSide = 1.5;
const actuatorColor = 0x00b227;
const armProperties = {
    low: {
        size: {
            radiusTop: armRadius,
            radiusBottom: armRadius,
            height: armLenght,
            radialDivisions: 32,
            heightDivisions: 16
        },
        position: {
            x: armLenght / 2,
            y: 0,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: - Math.PI / 2
        },
        texture: {
            color: robotColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'low_arm',
        type: 'cylinder'
    },
    high: {
        size: {
            radiusTop: armRadius,
            radiusBottom: armRadius,
            height: armLenght,
            radialDivisions: 32,
            heightDivisions: 16
        },
        position: {
            x: armLenght / 2,
            y: 0,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: - Math.PI / 2
        },
        texture: {
            color: robotColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'high_arm',
        type: 'cylinder'
    },
    actuator: {
        size: {
            width: actuatorSide,
            height: actuatorSide,
            depth: actuatorSide
        },
        position: {
            x: 0,
            y: armLenght / 2,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        texture: {
            color: actuatorColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'actuator',
        type: 'box'
    }
}

// Joints
const shpereJointRadius = 1.3;
const cylinderJointRadius = 0.65;
const jointsProperties = {
    body: {
        ankle: {
            constraints: {
                x: [0, 0], 
                y: [-Math.PI/2.6, Math.PI/2.6],                     // REMEMBER TO ADJUST THE ROTATIONS IN ORDER TO HAVE POSITIVE ROTATION FORWARD
                z: [-0.13, -Math.PI/3]
            },
            size: {
                radius: shpereJointRadius,
                widthDivisions: 32,
                heightDivisions: 16
            },
            position: {
                x: 0,
                y: shpereJointRadius / 2,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: - 0.13
            },
            texture: {
                color: metalColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'joint_ankle',
            type: 'sphere'
        },
        knee: {
            constraints: {
                x: [0, 0], 
                y: [0, 0],
                z: [2.07, 0]
            },
            size: {
                radius: shpereJointRadius * 0.8,
                widthDivisions: 32,
                heightDivisions: 16
            },
            position: {
                x: 0,
                y: legHeight / 2 + shpereJointRadius / 3,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 2.07
            },
            texture: {
                color: metalColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'joint_knee',
            type: 'sphere'
        },
        hip: {
            constraints: {
                x: [0, 0], 
                y: [0, 0],
                z: [-3*Math.PI/5, 0]
            },
            size: {
                radius: shpereJointRadius,
                widthDivisions: 32,
                heightDivisions: 16
            },
            position: {
                x: 0,
                y: legHeight / 2 + shpereJointRadius / 2,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: - 3 * Math.PI / 5
            },
            texture: {
                color: metalColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'joint_hip',
            type: 'sphere'
        },
        neck: {
            constraints: {
                x: [-Math.PI/2, Math.PI/2], 
                y: [-Math.PI/2, Math.PI/2],
                z: [0, Math.PI/4]
            },
            size: {
                radius: shpereJointRadius * 0.9,
                widthDivisions: 32,
                heightDivisions: 16
            },
            position: {
                x: 0,
                y: bustHeight / 2 + shpereJointRadius / 2,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            texture: {
                color: metalColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'joint_neck',
            type: 'sphere'
        }
    },
    arm: {
        shoulder: {
            constraints: {
                x: [0, 0],
                y: [Math.PI/3, Math.PI/2.8],
                z: [-Math.PI/2, Math.PI/2]
            },
            size: {
                radiusTop: cylinderJointRadius,
                radiusBottom: cylinderJointRadius,
                height: cylinderJointRadius * 1.8,
                radialDivisions: 32,
                heightDivisions: 16
            },
            position: {
                x: 0,
                y: bustHeight / 7 + cylinderJointRadius / 2,
                z: bustHeight / 6 + cylinderJointRadius / 2
            },
            rotation: {
                x: Math.PI / 2,
                y: 0,
                z: 0
            },
            texture: {
                color: metalColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'joint_shoulder',
            type: 'cylinder'
        },
        elbow: {
            constraints: {
                x: [-Math.PI/3, 0],
                y: [0, 0],
                z: [-3*Math.PI/2, 0]
            },
            size: {
                radiusTop: cylinderJointRadius,
                radiusBottom: cylinderJointRadius,
                height: cylinderJointRadius * 1.8,
                radialDivisions: 32,
                heightDivisions: 16
            },
            position: {
                x: 0,
                y: armLenght / 2,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: Math.PI / 2
            },
            texture: {
                color: metalColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'joint_elbow',
            type: 'cylinder'
        }
    }
};

// Robot
const robotProperties = {
    position: robotPosition,
    parts: {
        base: baseProperties,
        leg: legProperties,
        bust: bustProperties,
        arm: armProperties,
        head: headProperties,
    },
    joints: jointsProperties
};

// Fishing pole
const poleRadiusBottom = 0.22;
const poleRadiusTop = 0.08;
const poleLenght = 80;
const poleColor = 0x1a4a0e;
const polePosition = {
    x: robotPosition.x + poleLenght / 4,
    y: groundThickness / 2 + Math.sin(Math.PI/4)*poleLenght/2,
    z: robotPosition.z - 10
};
const poleRotation = {
    x: 0,
    y: 0,
    z: - Math.PI / 4
};
const reelColor = 0xa6ff00;
const floatingRadius = 0.5;
const floatingColor = 0xffa200;
const fishLineLenght = 15;
const fishLineColor = 0xedf6f4;
const fishLineRadius = 0.04;
const fishingPoleProperties = {
    position: polePosition,
    rotation: poleRotation,
    pole: {
        size: {
            radiusTop: poleRadiusTop,
            radiusBottom: poleRadiusBottom,
            height: poleLenght,
            radialDivisions: 32,
            heightDivisions: 16
        },
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        texture: {
            color: poleColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'fishingPole',
        type: 'cylinder'
    },
    reel: {
        size: {
            radiusTop: poleRadiusBottom * 4,
            radiusBottom: poleRadiusBottom * 4,
            height: poleRadiusBottom * 3,
            radialDivisions: 32,
            heightDivisions: 16
        },
        position: {
            x: 0,
            y: - poleLenght / 2 + 4,
            z: poleRadiusBottom * 3 / 2
        },
        rotation: {
            x: Math.PI / 2,
            y: 0,
            z: 0
        },
        texture: {
            color: reelColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'reel',
        type: 'cylinder'
    },
    fishline: {
        main: {
            constraints: {
                x: [0, 0],
                y: [6.5, 1],                  // Scale
                z: [Math.PI/7, Math.PI/2]   // Move
            },
            size: {
                radiusTop: fishLineRadius,
                radiusBottom: fishLineRadius,
                height: fishLineLenght,
                radialDivisions: 8,
                heightDivisions: 4
            },
            position: {
                x: 0,
                y: -fishLineLenght / 2,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            texture: {
                color: fishLineColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'fishLineMain',
            type: 'cylinder'
        },
        terminal: {
            size: {
                radiusTop: fishLineRadius,
                radiusBottom: fishLineRadius,
                height: fishLineLenght / 2,
                radialDivisions: 8,
                heightDivisions: 4
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            texture: {
                color: fishLineColor,
                map: null
            },
            shadows: {
                cast: true,
                receive: true
            },
            name: 'fishLineTerminal',
            type: 'cylinder'
        }
    },
    floating: {
        size: {
            radius: floatingRadius,
            widthDivisions: 32,
            heightDivisions: 16
        },
        position: {
            x: 0,
            y: -fishLineLenght / 2,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        texture: {
            color: floatingColor,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'floating',
        type: 'sphere'
    },
    rodHolder: {
        size: {
            radiusTop: 1,
            radiusBottom: 1,
            height: 2,
            radialDivisions: 32,
            heightDivisions: 16
        },
        position: {
            x: polePosition.x - Math.cos(Math.PI / 4) * poleLenght / 2 + 1, 
            y: groundThickness / 2 + 1,
            z: polePosition.z
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        texture: {
            color: 0x1b201f,
            map: null
        },
        shadows: {
            cast: true,
            receive: true
        },
        name: 'rodHolder',
        type: 'cylinder'
    }
};

/* ------------------ Rocks ------------------ */

const bigRocksPath = [
    {
        mtl: './objects/nature/rocks/bigRock1.mtl',
        obj: './objects/nature/rocks/bigRock1.obj'
    },
    {
        mtl: './objects/nature/rocks/bigRock2.mtl',
        obj: './objects/nature/rocks/bigRock2.obj'
    },
    {
        mtl: './objects/nature/rocks/bigRock3.mtl',
        obj: './objects/nature/rocks/bigRock3.obj'
    }
];
const flatRocksPath = [
    {
        mtl: './objects/nature/rocks/flatRock1.mtl',
        obj: './objects/nature/rocks/flatRock1.obj'
    },
    {
        mtl: './objects/nature/rocks/flatRock2.mtl',
        obj: './objects/nature/rocks/flatRock2.obj'
    },
    {
        mtl: './objects/nature/rocks/flatRock3.mtl',
        obj: './objects/nature/rocks/flatRock3.obj'
    },
    {
        mtl: './objects/nature/rocks/flatRock4.mtl',
        obj: './objects/nature/rocks/flatRock4.obj'
    },
    {
        mtl: './objects/nature/rocks/flatRock5.mtl',
        obj: './objects/nature/rocks/flatRock5.obj'
    }
];
const rocksPath = [
    {
        mtl: './objects/nature/rocks/rock1.mtl',
        obj: './objects/nature/rocks/rock1.obj'
    },
    {
        mtl: './objects/nature/rocks/rock2.mtl',
        obj: './objects/nature/rocks/rock2.obj'
    },
    {
        mtl: './objects/nature/rocks/rock3.mtl',
        obj: './objects/nature/rocks/rock3.obj'
    },
    {
        mtl: './objects/nature/rocks/rock4.mtl',
        obj: './objects/nature/rocks/rock4.obj'
    },
    {
        mtl: './objects/nature/rocks/rock5.mtl',
        obj: './objects/nature/rocks/rock5.obj'
    }
];
const smallRocksPath = [
    {
        mtl: './objects/nature/rocks/smallRock1.mtl',
        obj: './objects/nature/rocks/smallRock1.obj'
    },
    {
        mtl: './objects/nature/rocks/smallRock2.mtl',
        obj: './objects/nature/rocks/smallRock2.obj'
    },
    {
        mtl: './objects/nature/rocks/smallRock3.mtl',
        obj: './objects/nature/rocks/smallRock3.obj'
    },
    {
        mtl: './objects/nature/rocks/smallRock4.mtl',
        obj: './objects/nature/rocks/smallRock4.obj'
    }
];
const rocksProperties = [
    // Big Rocks
    {
        position: {x: 55, y: -groundThickness / 2, z: -90},
        rotation: {x: 0, y: 0, z: 0},
        shadows: {cast: true, receive: true},
        path: bigRocksPath[0]
    },
    {
        position: {x: 55, y: -groundThickness / 2, z: 95},
        rotation: {x: 0, y: Math.PI / 2, z: 0},
        shadows: {cast: true, receive: true},
        path: bigRocksPath[0]
    },
    {
        position: {x: 245, y: -groundThickness / 2, z: 90},
        rotation: {x: 0, y: 0.4, z: 0},
        shadows: {cast: true, receive: true},
        path: bigRocksPath[1]
    },
    {
        position: {x: 245, y: -groundThickness / 2, z: -95},
        rotation: {x: 0, y: 1.5, z: 0},
        shadows: {cast: true, receive: true},
        path: bigRocksPath[2]
    },
    // Flat Rocks
    {
        position: {x: 100, y: -groundThickness / 2, z: -10},
        rotation: {x: 0, y: 0.1, z: 0},
        shadows: {cast: true, receive: true},
        path: flatRocksPath[0]
    },
    {
        position: {x: 80, y: -groundThickness / 2, z: 30},
        rotation: {x: 0, y: Math.PI / 2, z: 0},
        shadows: {cast: true, receive: true},
        path: flatRocksPath[1]
    },
    {
        position: {x: 120, y: -groundThickness / 2, z: 50},
        rotation: {x: 0, y: 0.14, z: 0},
        shadows: {cast: true, receive: true},
        path: flatRocksPath[2]
    },
    {
        position: {x: 200, y: -groundThickness / 2, z: -60},
        rotation: {x: 0, y: 1.3, z: 0},
        shadows: {cast: true, receive: true},
        path: flatRocksPath[3]
    },
    {
        position: {x: 190, y: -groundThickness / 2, z: 20},
        rotation: {x: 0, y: 1.3, z: 0},
        shadows: {cast: true, receive: true},
        path: flatRocksPath[4]
    },
    // Normal Rocks
    {
        position: {x: 100, y: -groundThickness / 2, z: -20},
        rotation: {x: 0, y: 0.1, z: 0},
        shadows: {cast: true, receive: true},
        path: rocksPath[0]
    },
    {
        position: {x: 70, y: -groundThickness / 2, z: 37},
        rotation: {x: 0, y: Math.PI / 2, z: 0},
        shadows: {cast: true, receive: true},
        path: rocksPath[1]
    },
    {
        position: {x: 130, y: -groundThickness / 2, z: 40},
        rotation: {x: 0, y: 0.14, z: 0},
        shadows: {cast: true, receive: true},
        path: rocksPath[2]
    },
    {
        position: {x: 210, y: -groundThickness / 2, z: -70},
        rotation: {x: 0, y: 1.3, z: 0},
        shadows: {cast: true, receive: true},
        path: rocksPath[3]
    },
    {
        position: {x: 190, y: -groundThickness / 2, z: 0},
        rotation: {x: 0, y: 1.3, z: 0},
        shadows: {cast: true, receive: true},
        path: rocksPath[4]
    },
];

const natureProperties = {
    rocks: rocksProperties
};


export {
    shadowsOn, skyColor, groundThickness, groundColor,
    sceneProperties, cameraProperties,
    sunProperties, lightsProperties,
    fieldProperties,
    treesProperties,
    benchesProperties,
    fishesProperties,
    robotProperties,
    fishingPoleProperties,
    natureProperties
};
