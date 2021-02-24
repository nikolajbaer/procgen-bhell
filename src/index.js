import * as THREE from "three";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

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

    // Create a plane
    const groundBody = world.add({
        type: 'box',
        move: false,
        pos: [0,-0.5,0],
        size:[1000,1,1000],
    });
    var geometry = new THREE.PlaneGeometry( 1000, 1000, 50, 50 );
    var groundMaterial = new THREE.MeshLambertMaterial( { color: 0x111111 } );
    var groundMesh = new THREE.Mesh( geometry, groundMaterial );
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI/2;
    scene.add( groundMesh );

    camera.position.set(5,10,-10);
    camera.lookAt(new THREE.Vector3(0,0,0));

//    var controls = new OrbitControls( camera, renderer.domElement );
//	controls.minDistance = 10;
//    controls.maxDistance = 100;

    function animate() {
        requestAnimationFrame( animate );            
        const delta = clock.getDelta();
    	effect.render( scene, camera );
    }
    animate();
}

init();
