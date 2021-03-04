<<<<<<< HEAD
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
import { PlayerSystem } from "./systems/player";
import { GroundComponent } from "./components/map";
import { MapSystem } from "./systems/map";
import { ExplosionComponent } from "./components/effects";
import { EffectsSystem } from "./systems/effects";

function init_game(){

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
    world.registerComponent(GroundComponent)
    world.registerComponent(ExplosionComponent)

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

=======
import { init_game } from "./game"

// React
import React from "react";
import ReactDOM from "react-dom";
import { HUDSystem } from "./systems/hud";
import { observer } from "mobx-react-lite"

const HUDView = observer( ({ hudState }) => (
    <div id="overlay">
        <div className="hud">
            Score: {hudState.score} |
            Wave: {hudState.wave} |
            Health: {hudState.health} / {hudState.max_health}
        </div>
        <div className="hud">
            WASD to move, LMB/RMB to fire <br/>
            <a href="https://github.com/nikolajbaer/procgen-bhell" target="_blank" title="source code on github">&lt;src&gt;</a>
        </div>
    </div>    
))

class GameUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hudState: null }
    }

    componentDidMount(){
        const world = init_game()
        this.setState({hudState:world.getSystem(HUDSystem).state})
    }

    render() {

        let hud;
        if( this.state.hudState != null) {
            hud = <HUDView hudState={this.state.hudState} />
        }else{
            hud = <div></div>
        }

        return (
        <div id="game">
            <canvas id="render"></canvas>
            {hud}
        </div>
        )
    }
>>>>>>> reworked hud and react system with mobx per https://github.com/patreeceeo suggestion
}

init_game();
