import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import { World } from 'ecsy';
import { PhysicsComponent,MeshComponent } from './components.js'
import { PhysicsSystem, PhysicsMeshUpdateSystem } from './systems.js'
import * as CANNON from 'cannon-es'

function init(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const raycaster = new THREE.Raycaster();

    const SPEED = 10.0

    const mouse = new THREE.Vector2()
    const keys = {}

    const world = new World()
    world.registerComponent(PhysicsComponent)
    world.registerComponent(MeshComponent)
    world.registerSystem(PhysicsSystem)
    world.registerSystem(PhysicsMeshUpdateSystem)

    // Scene Lighting
    scene.fog = new THREE.Fog( 0x000000, 0, 500 );
    var ambient = new THREE.AmbientLight( 0xeeeeee );
    scene.add( ambient );
    var light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 10, 30, 20 );
    light.castShadow = true;
    scene.add( light );

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var clock = new THREE.Clock();

    var effect = new OutlineEffect( renderer );

    // Phsyics World
    const physicsWorld = new CANNON.World()
    physicsWorld.gravity.set(0, -10, 0)

    // Simplistically create ground body
    const groundPhysMaterial = new CANNON.Material('ground')
    const groundPhysShape = new CANNON.Plane()
    const groundBody = new CANNON.Body({ mass: 0, material: groundPhysMaterial })
    groundBody.addShape(groundPhysShape)
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    physicsWorld.addBody(groundBody)    

    // Create a plane
    var geometry = new THREE.PlaneGeometry( 1000, 1000, 50, 50 );
    var groundMaterial = new THREE.MeshLambertMaterial( { color: 0x111111 } );
    var groundMesh = new THREE.Mesh( geometry, groundMaterial );
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI/2;
    scene.add( groundMesh );

    // Add test object
    const size = 1
    const shape = new CANNON.Box(new CANNON.Vec3(size/2,size,size/2))
    const mat1 = new CANNON.Material() 
    const body1  = new CANNON.Body({
        mass:1, //mass
        material: mat1,
        position: new CANNON.Vec3(0,size,0),
        type: CANNON.Body.KINEMATIC,
    })
    body1.addShape(shape)
    body1.linearDamping = 0.01
    physicsWorld.addBody(body1)
   
    const boxGeometry = new THREE.BoxGeometry(size,size*2,size)
    const boxMaterial = new THREE.MeshLambertMaterial({ color:0xeeeeee})
    const mesh1 = new THREE.Mesh( boxGeometry, boxMaterial)
    mesh1.castShadow = true
    mesh1.receiveShadow = true
    scene.add(mesh1)

    const entity = world.createEntity()
    entity.addComponent( PhysicsComponent, { body: body1 })
    entity.addComponent( MeshComponent, { mesh: mesh1 })

    /*
    // https://threejs.org/docs/#api/en/objects/InstancedMesh
    // Spawning bUllets use InstancedMesh
    */

    // camera above player
    const CAM_OFFSET = new THREE.Vector3(0,40,-5)
    camera.position.copy(CAM_OFFSET)
    camera.lookAt(new THREE.Vector3(0,0,0));

    /*
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.enableKeys = false;
    */

    window.addEventListener('resize', onWindowResize)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function render(){
    	effect.render( scene, camera );
    }

    function updatePlayer(){
        // WASD/Arrow movement
        const vel = new CANNON.Vec3(0,0,0)
        if(keys["ArrowUp"] || keys["KeyW"]){ vel.z = 1
        }else if(keys["ArrowDown"] || keys["KeyS"]){ vel.z = -1 }

        if(keys["ArrowLeft"] || keys["KeyA"]){ vel.x = 1
        }else if(keys["ArrowRight"] || keys["KeyD"]){ vel.x = -1 }

        body1.velocity = vel.scale(SPEED)

        // Point in Mouse Direction where our mouse projects to the ground
        //body.rotation.set(mouse.angle()
        raycaster.setFromCamera( mouse, camera );
        const intersects = raycaster.intersectObjects( [groundMesh] )
        if(intersects.length){
            const target = new THREE.Vector2(
                intersects[0].point.x - body1.position.x,
                intersects[0].point.z - body1.position.z
            )
            body1.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -target.angle())
        }

        camera.position.copy(new THREE.Vector3(
            mesh1.position.x + CAM_OFFSET.x,
            mesh1.position.y + CAM_OFFSET.y,
            mesh1.position.z + CAM_OFFSET.z,
        ))
    }

    function animate() {
        requestAnimationFrame( animate );            

        const delta = clock.getDelta();
        const elapsed = clock.elapsedTime;

        updatePlayer()

        physicsWorld.step(delta)
        world.execute(delta,elapsed) 

        render()
    }
    animate();

    document.addEventListener("keydown", event => { keys[event.code] = true });
    document.addEventListener("keyup", event => { keys[event.code] = false });
    document.addEventListener("mousemove", event => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
        mouse.y = -( event.clientY / window.innerHeight) * 2 + 1
    })
}

init();
