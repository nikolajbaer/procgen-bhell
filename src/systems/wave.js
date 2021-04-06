import { System, Not } from "ecsy";
import { LocRotComponent, BodyComponent, PhysicsComponent, RotatorComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { Vector3 } from "../ecs_types"
import { PlayerComponent } from "../components/player";
import { PickupComponent, GunPickupComponent, HealthComponent } from "../components/pickup";
import { WaveMemberComponent } from "../components/wave";
import { GunComponent } from "../components/weapons";
import { gen_gun, gun_output_score } from "../procgen/guns"
import { SoundEffectComponent } from "../components/sound";
import { HUDMessageComponent } from "../components/hud";

export const WAVE_DELAY = 3 
export const PICKUP_RADIUS = 5
const BOSS_FRQ = 10

export class WaveSystem extends System {
    init(){
        this.wave = 1
        this.wave_delay = null
    }

    spawn_wave(){
        let n = 0
        if( this.wave % BOSS_FRQ == 0){
            // Spawn Boss and wave
            const boss = this.world.createEntity()
            boss.addComponent(WaveMemberComponent, { wave: this.wave, boss: true})
            n = 3 + this.wave % 10;
            for(var i=0; i < n; i++){
                const e = this.world.createEntity()
                e.addComponent(WaveMemberComponent, { wave: Math.max(this.wave-3,1) })
            }
            const e = this.world.createEntity()
            e.addComponent(SoundEffectComponent, { sound: "new-boss-wave" } )
        }else{
            n = Math.ceil(Math.pow(this.wave,.9) + 2)
            for(var i=0; i<n; i++){
                const e = this.world.createEntity()
                e.addComponent(WaveMemberComponent, { wave: this.wave })
            }
            const e = this.world.createEntity()
            e.addComponent(SoundEffectComponent, { sound: "new-wave" } )
        }

        return n
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
                        const e = this.world.createEntity()
                        const t = (Math.random() > 0.4)?"health":"gun"
                        e.addComponent(PickupComponent, { 
                            pickup_type: t, 
                            level: this.wave, 
                            spawn_pos: new Vector3(
                                player_body.position.x + (0.5 - Math.random()) * PICKUP_RADIUS,
                                player_body.position.y + 5,
                                player_body.position.z + (0.5 - Math.random()) * PICKUP_RADIUS,
                            ),
                            expires: (t=="gun")?time + 10: null
                        })
                    }
                    player.addComponent(HUDMessageComponent,{
                        message:`Wave ${this.wave}`,
                        duration: 2,
                    })
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