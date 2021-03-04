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
import { AIChasePlayerComponent, AITargetPlayerComponent } from "./components/ai_control";
import { AIControlSystem } from "./systems/ai_control";
import { PlayerSystem } from "./systems/player";
import { GroundComponent } from "./components/map";
import { MapSystem } from "./systems/map";
import { ExplosionComponent } from "./components/effects";
import { EffectsSystem } from "./systems/effects";
import { HUDSystem } from './systems/hud';


export function init_game(){
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
    world.registerComponent(AITargetPlayerComponent)
    world.registerComponent(GroundComponent)
    world.registerComponent(ExplosionComponent)
    world.registerComponent(AIChasePlayerComponent)

    // Systems
    world.registerSystem(PhysicsMeshUpdateSystem)
    world.registerSystem(PlayerControlsSystem)
    world.registerSystem(AimSystem)
    world.registerSystem(WeaponsSystem)
    world.registerSystem(BulletSystem)
    world.registerSystem(DamageSystem)
    world.registerSystem(EnemySystem)
    world.registerSystem(AIControlSystem)
    world.registerSystem(PlayerSystem)
    world.registerSystem(MapSystem)
    world.registerSystem(EffectsSystem)
    world.registerSystem(HUDSystem)

    // These go last as they manage mesh and body resource removal
    world.registerSystem(PhysicsSystem)
    world.registerSystem(RenderSystem)
    
    let lastTime = performance.now() / 1000

    function animate() {
        requestAnimationFrame( animate );            

        let time = performance.now() / 1000
        let delta = time - lastTime

        world.execute(delta,time) 
    }
    animate();

    return world
}
