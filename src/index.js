import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import * as CANNON from 'cannon-es'

function init(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const WORLD_RADIUS = 100
    const bodies = [];

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

    // Create world
    const world = new CANNON.World()
    world.gravity.set(0, -10, 0)

    // Create a plane
    var geometry = new THREE.PlaneGeometry( 1000, 1000, 50, 50 );
    var groundMaterial = new THREE.MeshLambertMaterial( { color: 0x111111 } );
    var groundMesh = new THREE.Mesh( geometry, groundMaterial );
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI/2;
    scene.add( groundMesh );

    // Create ground body
    const groundPhysMaterial = new CANNON.Material('ground')
    const groundPhysShape = new CANNON.Plane()
    const groundBody = new CANNON.Body({ mass: 0, material: groundPhysMaterial })
    groundBody.addShape(groundPhysShape)
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    world.addBody(groundBody)

    // Add test object
    const size = 1
    const sphereShape = new CANNON.Sphere(size/2)
    const mat1 = new CANNON.Material() 
    const body1  = new CANNON.Body({
        mass:1, //mass
        material: mat1,
        position: new CANNON.Vec3(0,10,0)
    })
    body1.addShape(sphereShape)
    body1.linearDamping = 0.01
    world.addBody(body1)
    const boxGeometry = new THREE.BoxGeometry(1)
    const boxMaterial = new THREE.MeshLambertMaterial({ color:0xeeeeee})
    const mesh1 = new THREE.Mesh( boxGeometry, boxMaterial)
    mesh1.castShadow = true
    mesh1.receiveShadow = true
    body1.mesh = mesh1
    scene.add(mesh1)
    bodies.push(body1)
    // https://threejs.org/docs/#api/en/objects/InstancedMesh
    // Spawning bUllets use InstancedMesh

    camera.position.set(5,10,-10);
    camera.lookAt(new THREE.Vector3(0,0,0));

    var controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 10;
    controls.maxDistance = 100;

    window.addEventListener('resize', onWindowResize)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function updatePhysics(delta) {
        // Step the physics world
        world.step(delta)

        // Copy coordinates from cannon.js to three.js
        bodies.forEach( body => {
            body.mesh.position.copy(body.position)
            body.mesh.quaternion.copy(body.quaternion)
        })
    }

    function render(){
    	effect.render( scene, camera );
    }

    function animate() {
        requestAnimationFrame( animate );            

        const delta = clock.getDelta();
        updatePhysics(delta)
        render()
    }
    animate();
}

init();
