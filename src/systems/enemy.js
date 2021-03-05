import { System, Not } from "ecsy";
import { EnemyComponent } from "../components/enemy";
import { LocRotComponent, BodyComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { DamageableComponent } from "../components/damage"
import { Vector3 } from "../ecs_types"
import { PlayerComponent } from "../components/player";
import { AIChasePlayerComponent, AITargetPlayerComponent } from "../components/ai_control";
import { FireControlComponent, GunComponent, KamykazeComponent } from "../components/weapons";

const WAVE_DELAY = 1.5

export class EnemySystem extends System {
    init(){
        this.wave = 1
        this.wave_delay = null
    }

    spawn_wave(){
        const n = this.wave * 2
        for(var i=0; i<n; i++){
            const boxEntity = this.world.createEntity()
            boxEntity.addComponent( LocRotComponent, { location: new Vector3((0.5 - Math.random()) * 20,5,(0.5 - Math.random()) * 20) } )
            boxEntity.addComponent( EnemyComponent )
            if(Math.random() > 0.8){
                boxEntity.addComponent( AIChasePlayerComponent )
                boxEntity.addComponent( ModelComponent, {
                    material: "enemy:chaser",
                    geometry: "sphere",
                    scale: new Vector3(0.5,0.5,0.5),
                } )
                boxEntity.addComponent( BodyComponent , { 
                    bounds_type: BodyComponent.SPHERE_TYPE, 
                    mass: 1 ,
                    material: "chaser", // higher friction
                } )
                boxEntity.addComponent( KamykazeComponent )
            }else{
                boxEntity.addComponent( AITargetPlayerComponent )
                boxEntity.addComponent( GunComponent, { rate_of_fire: 1 } )
                boxEntity.addComponent( FireControlComponent )
                boxEntity.addComponent( ModelComponent, {material: "enemy:shooter"} )
                boxEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 1 } )
            }
            boxEntity.addComponent( DamageableComponent, { health: 2 } )
        }
        return n
    }

    execute(delta,time){
        if(this.queries.player.results.length > 0){
            const player = this.queries.player.results[0]
            const player_c = player.getMutableComponent(PlayerComponent)

            if(this.queries.active.results.length == 0){
                if(this.wave_delay == null){
                    this.wave_delay = time + WAVE_DELAY
                }else if(this.wave_delay <= time){
                    this.wave_delay = null 
                    // Spawn enemies
                    player_c.current_wave_enemies = this.spawn_wave()
                    player_c.wave = this.wave
                    this.wave += 1
                }
            }

            if(this.queries.player.results.length > 0){
                this.queries.active.removed.forEach( e => {
                    player_c.score += 1
                })
            }
        }
    }
}

EnemySystem.queries = {
    active: {
        components: [ EnemyComponent ],
        listen: {
            removed: true
        }
    },
    player: {
        components: [ PlayerComponent ]
    }
}