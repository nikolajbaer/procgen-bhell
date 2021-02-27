import { System, Not } from "ecsy";
import { LocRotComponent } from "../components/physics"
import { MeshComponent, ModelComponent, CameraFollowComponent, RayCastTargetComponent } from "../components/render"
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

        const domElement = document.getElementById("render") 
        let renderer = new THREE.WebGLRenderer({ antialias: true, canvas: domElement });
        renderer.shadowMap.enabled = true;
        //renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.setSize( window.innerWidth, window.innerHeight );

        let raycaster = new THREE.Raycaster();

        let effect = new OutlineEffect( renderer );

        this.effect = effect
        this.renderer = renderer
        this.camera = camera
        this.scene = scene
        this.raycaster = raycaster
    
        window.addEventListener('resize', e => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        })

        // debug
        window.scene = scene
        window.camera = camera

        /* does not play nice with mouse controls
        var controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 10;
        controls.maxDistance = 100;
        */
    }

    execute(delta){
        // Initialize meshes for any uninitialized models
        this.queries.unitialized.results.forEach( e => {
            const loc = e.getComponent(LocRotComponent)
            const model = e.getComponent(ModelComponent)
            const mesh = new THREE.Mesh( GEOMETRIES[model.geometry] , MATERIALS[model.material])
            mesh.receiveShadow = model.shadow
            mesh.castShadow = model.shadow 
            mesh.scale.set( model.scale.x,model.scale.y,model.scale.z)
            mesh.position.set(loc.location.x,loc.location.y,loc.location.z)
            this.scene.add( mesh )
            e.addComponent( MeshComponent, { mesh: mesh })
        })

        // track camera for anny cam follows
        this.queries.camera_follow.results.forEach( e => {
            const follow = e.getComponent(CameraFollowComponent)
            const pos = e.getComponent(MeshComponent).mesh.position

            this.camera.position.set( 
                pos.x + follow.offset.x,
                pos.y + follow.offset.y,
                pos.z + follow.offset.z
            )
            this.camera.lookAt(pos);

        })

        // update any raycasts
        this.queries.raycasts.results.forEach( e => {
            const mesh = e.getComponent(MeshComponent)
            const caster = e.getMutableComponent(RayCastTargetComponent)

            const mouse = new THREE.Vector2( caster.mouse.x, caster.mouse.y)
            this.raycaster.setFromCamera( mouse, this.camera );

            const intersects = this.raycaster.intersectObjects( [mesh.mesh] )

            if(intersects.length){
                const p = intersects[0].point 
                caster.location.x = p.x
                caster.location.y = p.y
                caster.location.z = p.z
            }
        })

        // todo cleanup removed
        this.queries.entities.removed.forEach( e => {
            const mesh = e.getRemovedComponent(MeshComponent).mesh
            this.scene.remove(mesh)
        })


    	//this.effect.render( this.scene, this.camera );
        this.renderer.render( this.scene, this.camera )
    }
}

RenderSystem.queries = {
    unitialized: {
        components: [ ModelComponent, LocRotComponent, Not(MeshComponent)]
    },
    camera_follow: {
        components: [ CameraFollowComponent, MeshComponent ] // Maybe camera follow component?
    },
    raycasts: {
        components: [ RayCastTargetComponent, MeshComponent ]
    },
    entities: {
        components: [MeshComponent],
        listen: {
            removed: true,
        }
    }
}
