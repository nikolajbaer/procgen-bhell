import { World } from 'ecsy';
import { BodyComponent, LocRotComponent, PhysicsComponent, RotatorComponent } from './components/physics'
import { MeshComponent, ModelComponent, CameraFollowComponent, RayCastTargetComponent, CameraShakeComponent } from './components/render'
import { GunComponent, BulletComponent, FireControlComponent, ProxyMineComponent, OutOfAmmoComponent } from "./components/weapons";
import { PhysicsSystem, PhysicsMeshUpdateSystem } from './systems/physics'
import { DamageableComponent, DamageAppliedComponent, HealableComponent, HealthAppliedComponent} from './components/damage'
import { RenderSystem } from "./systems/render"
import { PlayerControlsSystem } from "./systems/player_controls"
import { DamageSystem } from "./systems/damage"
import { WeaponsSystem, AimSystem, BulletSystem, ProxyMineSystem } from "./systems/weapons";
import { EnemyComponent, ShakeGroundComponent } from "./components/enemy";
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
import { PickupComponent, GunPickupComponent, HealthComponent } from './components/pickup';
import { WaveMemberComponent } from './components/wave';
import { WaveSystem } from './systems/wave';
import { InventoryComponent } from './components/inventory';
import { InventorySystem } from './systems/inventory';
import { PickupSystem } from './systems/pickup';
import { HUDMessageComponent } from './components/hud';


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
    world.registerComponent(PickupComponent)
    world.registerComponent(OutOfAmmoComponent)
    world.registerComponent(HUDMessageComponent)
    world.registerComponent(ShakeGroundComponent)

    // Systems
    world.registerSystem(SoundSystem)
    world.registerSystem(PhysicsMeshUpdateSystem)
    world.registerSystem(PlayerControlsSystem)
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
    world.registerSystem(PickupSystem)

    // These go last as they manage mesh and body resource removal
    world.registerSystem(PhysicsSystem)
    world.registerSystem(RenderSystem)

    window.ecsy_world = world

    // update sound preference
    if(playSound){
        world.getSystem(SoundSystem).activate()
    }
    
    let lastTime = performance.now() / 1000

    let paused = false

    window.addEventListener("keypress", (e) => {
        if(e.key == " "){
            paused = !paused
        }
    })

    function animate() {
        requestAnimationFrame( animate );            
        if(paused){ return }

        let time = performance.now() / 1000
        let delta = time - lastTime

        const perf_t0 = time
        world.execute(delta,time) 
        const perf_t1 = performance.now()

        // calc perf metrics
        const frame_time = perf_t1 - perf_t0
        window.game_perf = {
            fps: frame_time,
            phys_time: window.perf_phys,
            ren_time: window.perf_ren,
            systems: world.getSystems().map( s => [s.constructor.name,s.executeTime] )
        }

    }
    animate();

    // manually set perf display in console
    if(window.perf_interval == undefined && window.show_debug_perf ){
        const debug_el = document.getElementById("perf")
        window.perf_interval = setInterval(() => {
            if(window.game_perf == undefined){ return }
            let output = `FPS ${window.game_perf.fps.toFixed(3)} Phys: ${window.game_perf.phys_time.toFixed(3)} Render: ${window.game_perf.ren_time.toFixed(3)}\n`
            window.game_perf.systems.sort( (a,b) => { return b[1] - a[1] })
            window.game_perf.systems.forEach( s=> {
                output += `${s[0]}: ${s[1].toFixed(2)}\n`
            }) 
            debug_el.innerText = output
        },1000)
    }


    return world
}

