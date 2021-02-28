import * as THREE from "three"
import { World } from 'ecsy';
import { BodyComponent, LocRotComponent, PhysicsComponent } from './components/physics'
import { MeshComponent, ModelComponent, CameraFollowComponent, RayCastTargetComponent } from './components/render'
import { GunComponent, BulletComponent, FireControlComponent } from "./components/weapons";
import { PhysicsSystem, PhysicsMeshUpdateSystem } from './systems/physics'
import { DamageableComponent, DamageAppliedComponent} from './components/damage'
import { RenderSystem } from "./systems/render"
import { PlayerControlsSystem } from "./systems/player_controls"
import { DamageSystem } from "./systems/damage"
import { WeaponsSystem, AimSystem, BulletSystem } from "./systems/weapons";
import { EnemyComponent } from "./components/enemy";
import { PlayerComponent } from "./components/player"
import { EnemySystem } from "./systems/enemy";
import { Vector3 } from "./ecs_types"
import { AITargetPlayer } from "./components/ai_control";
import { AIControlSystem } from "./systems/ai_control";

function init(){

    const world = new World()

    // Components
    world.registerComponent(LocRotComponent)
    world.registerComponent(BodyComponent)
    world.registerComponent(PhysicsComponent)
    world.registerComponent(MeshComponent)
    world.registerComponent(CameraFollowComponent)
    world.registerComponent(ModelComponent)
    world.registerComponent(RayCastTargetComponent)
    world.registerComponent(GunComponent)
    world.registerComponent(BulletComponent)
    world.registerComponent(FireControlComponent)
    world.registerComponent(DamageAppliedComponent)
    world.registerComponent(DamageableComponent)
    world.registerComponent(EnemyComponent)
    world.registerComponent(PlayerComponent)
    world.registerComponent(AITargetPlayer)

    // Systems
    world.registerSystem(PhysicsMeshUpdateSystem)
    world.registerSystem(PlayerControlsSystem)
    world.registerSystem(AimSystem)
    world.registerSystem(WeaponsSystem)
    world.registerSystem(BulletSystem)
    world.registerSystem(DamageSystem)
    world.registerSystem(EnemySystem)
    world.registerSystem(AIControlSystem)

    // These go last as they manage mesh and body resource removal
    world.registerSystem(PhysicsSystem)
    world.registerSystem(RenderSystem)
    
    const groundEntity = world.createEntity()
    groundEntity.addComponent( BodyComponent, {
        mass: 0,
        bounds_type: BodyComponent.PLANE_TYPE,
        body_type: BodyComponent.STATIC,
        material: "ground"
    })
    groundEntity.addComponent( LocRotComponent, { rotation: new Vector3(-Math.PI/2,0,0) } )
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
    playerEntity.addComponent( LocRotComponent, { location: new Vector3(0,size/2,0) } )
    playerEntity.addComponent( ModelComponent, { geometry: "box", material: "player" } )
    playerEntity.addComponent( GunComponent )
    playerEntity.addComponent( FireControlComponent )
    playerEntity.addComponent( PlayerComponent )
    playerEntity.addComponent( DamageableComponent, { health: 25, max_health: 25 } )
    playerEntity.addComponent( CameraFollowComponent, { offset: new Vector3(0,40,-5) })

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
