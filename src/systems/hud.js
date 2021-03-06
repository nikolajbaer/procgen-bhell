import { System } from "ecsy"
import { makeAutoObservable, runInAction } from "mobx"
import { DamageableComponent } from "../components/damage"
import { EnemyComponent } from "../components/enemy"
import { PlayerComponent } from "../components/player"


export class HUDState {
    score = 0
    health = 100
    max_health = 100
    wave = 0
    total_enemies = 0
    enemies_left = 0
    deaths = 0
    lives = 1

    constructor(){
        makeAutoObservable(this)
    }

}

export class HUDSystem extends System {
    init(){
        this.state = new HUDState()
    }

    execute(delta,time){
        if( this.queries.player.results.length == 0){ 
            if(this.queries.player.removed.length == 0 ){
                return
            }else{
                // When player goes away, we are assuming for now that
                // they died, so we do one last update
                runInAction( () => {
                    this.state.health = 0
                })
                return
            }
        }

        const player = this.queries.player.results[0]
        const player_c = player.getComponent(PlayerComponent)
        const damage = player.getComponent(DamageableComponent)

        // update the state
        // use runInAction per https://stackoverflow.com/a/64771774
        runInAction( () => {
            this.state.score = player_c.score
            this.state.health = damage.health
            this.state.max_health = damage.max_health
            this.state.wave = player_c.wave
            this.state.total_enemies = player_c.current_wave_enemies
            this.state.enemies_left = this.queries.enemies.results.length
        })

    }
}

HUDSystem.queries = {
    player: {
        components: [PlayerComponent,DamageableComponent],
        listen: {
            removed: true
        }

    },
    enemies: {
        components: [EnemyComponent]
    },
}