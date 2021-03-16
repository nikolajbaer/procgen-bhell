import { World } from 'ecsy';
import { BodyComponent, LocRotComponent, PhysicsComponent, RotatorComponent } from './components/physics'
import { MeshComponent, ModelComponent, CameraFollowComponent, RayCastTargetComponent, CameraShakeComponent } from './components/render'
import { GunComponent, BulletComponent, FireControlComponent, ProxyMineComponent } from "./components/weapons";
import { PhysicsSystem, PhysicsMeshUpdateSystem } from './systems/physics'
import { DamageableComponent, DamageAppliedComponent, HealableComponent, HealthAppliedComponent} from './components/damage'
import { RenderSystem } from "./systems/render"
import { PlayerControlsSystem } from "./systems/player_controls"
import { DamageSystem } from "./systems/damage"
import { WeaponsSystem, AimSystem, BulletSystem, ProxyMineSystem } from "./systems/weapons";
import { EnemyComponent } from "./components/enemy";
import { PlayerComponent } from "./components/player"
import { EnemySystem } from "./systems/enemy";
import { Vector3 } from "./ecs_types"
import { AIChasePlayerComponent, AITargetPlayerComponent } from "./components/ai_control";
import { AIControlSystem } from "./systems/ai_control";
import { PlayerSystem } from "./systems/player";
import { GroundComponent } from "./components/map";
import { MapSystem } from "./systems/map";
import { DamageFlashEffectComponent, ExplosionComponent } from "./components/effects";
import { EffectsSystem } from "./systems/effects";
import { HUDSystem } from './systems/hud';
import { SoundSystem } from './systems/sound';
import { MusicLoopComponent, SoundEffectComponent } from './components/sound';
import { GunPickupComponent, HealthComponent } from './components/pickups';
import { WaveMemberComponent } from './components/wave';
import { WaveSystem } from './systems/wave';
import { InventoryComponent } from './components/inventory';
import { InventorySystem } from './systems/inventory';


export function init_game(playSound){
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
    world.registerComponent(ProxyMineComponent)
    world.registerComponent(SoundEffectComponent)
    world.registerComponent(HealthComponent)
    world.registerComponent(HealableComponent)
    world.registerComponent(HealthAppliedComponent)
    world.registerComponent(DamageFlashEffectComponent)
    world.registerComponent(WaveMemberComponent)
    world.registerComponent(GunPickupComponent)
    world.registerComponent(InventoryComponent)
    world.registerComponent(RotatorComponent)
    world.registerComponent(MusicLoopComponent)
    world.registerComponent(CameraShakeComponent)

    // Systems
    world.registerSystem(SoundSystem)
    world.registerSystem(PhysicsMeshUpdateSystem)
    world.registerSystem(PlayerControlsSystem)
    //world.registerSystem(AimSystem)
    world.registerSystem(WeaponsSystem)
    world.registerSystem(BulletSystem)
    world.registerSystem(DamageSystem)
    world.registerSystem(EnemySystem)
    world.registerSystem(AIControlSystem)
    world.registerSystem(PlayerSystem)
    world.registerSystem(MapSystem)
    world.registerSystem(EffectsSystem)
    world.registerSystem(HUDSystem)
    world.registerSystem(ProxyMineSystem)
    world.registerSystem(WaveSystem)
    world.registerSystem(InventorySystem)

    // These go last as they manage mesh and body resource removal
    world.registerSystem(PhysicsSystem)
    world.registerSystem(RenderSystem)

    // update sound preference
    if(playSound){
        world.getSystem(SoundSystem).activate()
    }
    
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

