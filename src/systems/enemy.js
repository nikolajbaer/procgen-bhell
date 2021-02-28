import { System, Not } from "ecsy";
import { EnemyComponent } from "../components/enemy";
import { LocRotComponent, BodyComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { DamageableComponent } from "../components/damage"
import { Vector3 } from "../ecs_types"
import { PlayerComponent } from "../components/player";
import { AITargetPlayer } from "../components/ai_control";
import { FireControlComponent, GunComponent } from "../components/weapons";

const WAVE_DELAY = 1.5

export class EnemySystem extends System {
    init(){
        this.wave = 1
        this.wave_delay = null
    }

    spawn_wave(){
        for(var i=0; i<this.wave * 2; i++){
            const boxEntity = this.world.createEntity()
            boxEntity.addComponent( LocRotComponent, { location: new Vector3((0.5 - Math.random()) * 20,5,(0.5 - Math.random()) * 20) } )
            boxEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 1 })
            boxEntity.addComponent( ModelComponent )
            boxEntity.addComponent( EnemyComponent )
            boxEntity.addComponent( AITargetPlayer )
            boxEntity.addComponent( GunComponent )
            boxEntity.addComponent( FireControlComponent )
            boxEntity.addComponent( DamageableComponent, { health: 10 } )
        }
    }

    execute(delta,time){
        if(this.queries.active.results.length == 0){
            if(this.wave_delay == null){
                this.wave_delay = time + WAVE_DELAY
            }else if(this.wave_delay <= time){
                this.wave_delay = null 
                // Spawn enemies
                this.spawn_wave()
                this.wave += 1
            }
        }

        if(this.queries.player.results.length > 0){
            const player = this.queries.player.results[0]
            const player_c = player.getMutableComponent(PlayerComponent)
            this.queries.active.removed.forEach( e => {
                player_c.score += 1
                console.log("score is now ",player_c.score)
            })

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