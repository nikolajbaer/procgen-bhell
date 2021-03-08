import { System, Not } from "ecsy";
import { EnemyComponent } from "../components/enemy";
import { LocRotComponent, BodyComponent, PhysicsComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { DamageableComponent } from "../components/damage"
import { Vector3 } from "../ecs_types"
import { PlayerComponent } from "../components/player";
import { AIChasePlayerComponent, AITargetPlayerComponent } from "../components/ai_control";
import { FireControlComponent, GunComponent, ProxyMineComponent } from "../components/weapons";
import { HealthComponent } from "../components/pickups";

const WAVE_DELAY = 3 

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
            const r = Math.random()
            if(r > 0.8){ // Chaser
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
                boxEntity.addComponent( ProxyMineComponent )
                boxEntity.addComponent( DamageableComponent, { health: 3 } )
            }else if(r > 0.7){ // Sharp Shooter
                boxEntity.addComponent( AITargetPlayerComponent, { predict: true, max_distance: 30 } )
                boxEntity.addComponent( GunComponent, { rate_of_fire: 2, bullet_damage: 2,bullet_material: "bullet-shooter2", bullet_speed: 5 } )
                boxEntity.addComponent( FireControlComponent )
                boxEntity.addComponent( ModelComponent, {material: "enemy:shooter2"} )
                boxEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 1 } )
                boxEntity.addComponent( DamageableComponent, { health: 3 } )
            }else if(r > 0.65){ // Big Daddy
                boxEntity.addComponent( AITargetPlayerComponent, { predict: true, max_distance: 30 } )
                boxEntity.addComponent( GunComponent, { 
                    rate_of_fire: 3, 
                    bullet_damage: 10, 
                    bullet_material: "default_bullet", 
                    bullet_speed: 2.5 ,
                    bullet_scale: new Vector3(0.4,0.4,0.4),
                    bullet_mass: 15,
                    bullet_sound: "big-bullet-fire",
                } )
                boxEntity.addComponent( FireControlComponent )
                boxEntity.addComponent( ModelComponent, {material: "enemy:shooter3", scale: new Vector3(1.5,1.5,1.5) } )
                boxEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 5, bounds: new Vector3(1.5,1.5,1.5) } )
                boxEntity.addComponent( DamageableComponent, { health: 5 } )
            }else{ // Grunt
                boxEntity.addComponent( AITargetPlayerComponent )
                boxEntity.addComponent( FireControlComponent )
                boxEntity.addComponent( GunComponent, { rate_of_fire: 1 , bullet_damage: 0.5 } )
                boxEntity.addComponent( ModelComponent, {material: "enemy:shooter"} )
                boxEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 1 } )
                boxEntity.addComponent( DamageableComponent, { health: 2 } )
            }
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
        components: [ PlayerComponent, PhysicsComponent ]
    }
}