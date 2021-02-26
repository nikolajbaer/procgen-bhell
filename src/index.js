import * as THREE from "three"
import { World } from 'ecsy';
import { BodyComponent, LocRotComponent, PhysicsComponent } from './components/physics'
import { MeshComponent, ModelComponent, CameraFollowComponent, RayCastTargetComponent } from './components/render'
import { ShooterComponent, GunComponent, BulletComponent } from "./components/weapons";
import { PhysicsSystem, PhysicsMeshUpdateSystem } from './systems/physics'
import { RenderSystem } from "./systems/render"
import { ControlsSystem } from "./systems/controls"
import { ControlsComponent } from "./components/controls";
import { WeaponsSystem } from "./systems/weapons";

function init(){

    const world = new World()
    world.registerComponent(LocRotComponent)
    world.registerComponent(BodyComponent)
    world.registerComponent(PhysicsComponent)
    world.registerComponent(MeshComponent)
    world.registerComponent(CameraFollowComponent)
    world.registerComponent(ModelComponent)
    world.registerComponent(ControlsComponent)
    world.registerComponent(RayCastTargetComponent)
    world.registerComponent(ShooterComponent)
    world.registerComponent(GunComponent)
    world.registerComponent(BulletComponent)
    world.registerSystem(PhysicsSystem)
    world.registerSystem(PhysicsMeshUpdateSystem)
    world.registerSystem(RenderSystem)
    world.registerSystem(ControlsSystem)
    world.registerSystem(WeaponsSystem)
    
    const groundEntity = world.createEntity()
    groundEntity.addComponent( BodyComponent, {
        mass: 0,
        bounds_type: BodyComponent.PLANE_TYPE,
        body_type: BodyComponent.STATIC,
        material: "ground"
    })
    groundEntity.addComponent( LocRotComponent, { rotx:-Math.PI/2 } )
    groundEntity.addComponent( ModelComponent, { geometry: "ground", material: "ground" })
    groundEntity.addComponent( RayCastTargetComponent )
  
    const size = 1
    // temp gun
    /*
    const gunGeometry = new THREE.BoxGeometry(size*2,size/4,size/4)
    const gunMaterial = new THREE.MeshLambertMaterial({ color:0x333333})
    const gunMesh = new THREE.Mesh( gunGeometry, gunMaterial )
    gunMesh.position.x = size/2
    gunMesh.position.z = size/1.9
    gunMesh.castShadow = true
    gunMesh.receiveShadow = true
    gunMesh.rotation.x = Math.PI/4
    mesh1.add(gunMesh)
    */

    const playerEntity = world.createEntity()
    playerEntity.addComponent( BodyComponent, { 
        mass: 1, 
        bounds_type: BodyComponent.BOX_TYPE, 
        body_type: BodyComponent.KINEMATIC,
        material: "default" 
    })
    playerEntity.addComponent( LocRotComponent, { y:size/2 } )
    playerEntity.addComponent( ModelComponent, { geometry: "box", material: "player" } )
    playerEntity.addComponent( ControlsComponent )
    playerEntity.addComponent( ShooterComponent )
    playerEntity.addComponent( GunComponent )
    playerEntity.addComponent( CameraFollowComponent, { offset_x: 0, offset_y: 40, offset_z: -5 })

    const boxEntity = world.createEntity()
    boxEntity.addComponent( LocRotComponent, { x:5, y:5, z:5 } )
    boxEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 12 })
    boxEntity.addComponent( ModelComponent )

    let lastTime = performance.now() / 1000

    function animate() {
        requestAnimationFrame( animate );            

        let time = performance.now() / 1000
        let delta = time - lastTime

        world.execute(delta,time) 
    }
    animate();

}

init();
