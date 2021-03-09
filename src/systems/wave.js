import { System, Not } from "ecsy";
import { LocRotComponent, BodyComponent, PhysicsComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { Vector3 } from "../ecs_types"
import { PlayerComponent } from "../components/player";
import { HealthComponent } from "../components/pickups";
import { WaveMemberComponent } from "../components/wave";

const WAVE_DELAY = 3 

export class WaveSystem extends System {
    init(){
        this.wave = 1
        this.wave_delay = null
    }

    spawn_wave(){
        const n = this.wave * 2

        for(var i=0; i<n; i++){
            const e = this.world.createEntity()
            e.addComponent(WaveMemberComponent, { wave: this.wave })
        }

        return n
    }

    spawn_pickup(pos){
        const e  = this.world.createEntity() 
        e.addComponent( HealthComponent )
        e.addComponent( LocRotComponent, { 
            location: new Vector3((0.5 - Math.random()) * 5 + pos.x,8,(0.5 - Math.random()) * 5 + pos.z) 
        })
        e.addComponent( ModelComponent, {
            material: "health-pickup",
            geometry: "box",
            scale: new Vector3(0.5,0.5,0.5),
        } )
        e.addComponent( BodyComponent , { 
            bounds_type: BodyComponent.BOX_TYPE, 
            mass: 1 ,
            bounds: new Vector3(0.5,0.5,0.5),
            material: "chaser",
            track_collisions: true,
        } )
    }

    execute(delta,time){
        if(this.queries.player.results.length > 0){
            const player = this.queries.player.results[0]
            const player_c = player.getMutableComponent(PlayerComponent)
            const player_body = player.getComponent(PhysicsComponent).body

            if(this.queries.active.results.length == 0){
                if(this.wave_delay == null){
                    this.wave_delay = time + WAVE_DELAY
                    if( this.wave > 1 && Math.random() > 0.6){
                        this.spawn_pickup(player_body.position)
                    }
                }else if(this.wave_delay <= time){
                    this.wave_delay = null 
                    // Spawn enemies
                    player_c.current_wave_enemies = this.spawn_wave()
                    player_c.wave = this.wave
                    this.wave += 1
                }
            }
        }
    }
}
WaveSystem.queries = {
    active: {
        components: [ WaveMemberComponent ],
    },
    player: {
        components: [ PlayerComponent, PhysicsComponent ]
    }
}