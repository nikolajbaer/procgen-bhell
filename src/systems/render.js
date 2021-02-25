import { System, Not } from "ecsy";
import { MeshComponent, ModelComponent, CameraFollowComponent } from "../components/render"
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import { GEOMETRIES, MATERIALS } from "../assets"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ControlsComponent } from "../components/controls";
        
export class RenderSystem extends System {
    init() {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

        // Scene Lighting
        scene.fog = new THREE.Fog( 0x000000, 0, 500 );
        var ambient = new THREE.AmbientLight( 0xeeeeee );
        scene.add( ambient );
        var light = new THREE.PointLight( 0xffffff, 0.5, 100 );
        light.position.set( 10, 30, 0 );
        light.castShadow = true;
        scene.add( light );

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        let effect = new OutlineEffect( renderer );

        this.effect = effect
        this.renderer = renderer
        this.camera = camera
        this.scene = scene
    
        window.addEventListener('resize', e => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        })

        // debug
        window.scene = scene
        window.camera = camera
        var controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 10;
        controls.maxDistance = 100;
    }

    execute(delta){

        this.queries.unitialized.results.forEach( e => {
            const model = e.getComponent(ModelComponent)
            const mesh = new THREE.Mesh( GEOMETRIES[model.geometry] , MATERIALS[model.material])
            mesh.receiveShadow = true
            mesh.castShadow = true
            this.scene.add( mesh )
            e.addComponent( MeshComponent, { mesh: mesh })
        })

        this.queries.camera_follow.results.forEach( e => {
            const follow = e.getComponent(CameraFollowComponent)
            const pos = e.getComponent(MeshComponent).mesh.position

            this.camera.position.set( 
                pos.x + follow.offset_x,
                pos.y + follow.offset_y,
                pos.z + follow.offset_z
            )
            this.camera.lookAt(pos);

        })


        // todo cleanup removed


    	this.effect.render( this.scene, this.camera );
    }
}

RenderSystem.queries = {
    unitialized: {
        components: [ ModelComponent, Not(MeshComponent)]
    },
    camera_follow: {
        components: [ CameraFollowComponent, MeshComponent ] // Maybe camera follow component?
    },
    removed: {
        components: [MeshComponent],
        listen: {
            removed: true,
        }
    }
}
