import { System, Not } from "ecsy";
import { LocRotComponent, BodyComponent, PhysicsComponent, RotatorComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { Vector3 } from "../ecs_types"
import { PlayerComponent } from "../components/player";
import { GunPickupComponent, HealthComponent } from "../components/pickups";
import { WaveMemberComponent } from "../components/wave";
import { GunComponent } from "../components/weapons";
import { gen_gun, gun_output_score } from "../procgen/guns"

export const WAVE_DELAY = 3 

export class WaveSystem extends System {
    init(){
        this.wave = 1
        this.wave_delay = null
    }

    spawn_wave(){
        const n = Math.ceil(Math.pow(this.wave,.9) + 2)

        for(var i=0; i<n; i++){
            const e = this.world.createEntity()
            e.addComponent(WaveMemberComponent, { wave: this.wave })
        }

        return n
    }

    spawn_pickup(pos){
        const e  = this.world.createEntity() 
        e.addComponent( LocRotComponent, { 
            location: new Vector3((0.5 - Math.random()) * 5 + pos.x,8,(0.5 - Math.random()) * 5 + pos.z) 
        })

        const r =  Math.random()
        if( r > 0.6 ){
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
            e.addComponent( HealthComponent )
        }else if( r > 0.0 ){
            const gun = gen_gun(1,false) 
            e.addComponent( ModelComponent, {
                material: gun.bullet_material,
                geometry: "box",
                scale: new Vector3(1.5,0.5,0.5),
            } )
            e.addComponent( BodyComponent , { 
                bounds_type: BodyComponent.BOX_TYPE, 
                mass: 1 ,
                bounds: new Vector3(1.5,0.5,0.5),
                track_collisions: true,
                fixed_rotation: true
            } )
            e.addComponent( GunPickupComponent )
            e.addComponent( GunComponent, gun )
            e.addComponent( RotatorComponent ) // slow spin
        }
    }

    execute(delta,time){
        if(this.queries.player.results.length > 0){
            const player = this.queries.player.results[0]
            const player_c = player.getMutableComponent(PlayerComponent)
            const player_body = player.getComponent(PhysicsComponent).body

            if(this.queries.active.results.length == 0){
                if(this.wave_delay == null){
                    this.wave_delay = time + WAVE_DELAY
                    if( this.wave > 1 ){
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