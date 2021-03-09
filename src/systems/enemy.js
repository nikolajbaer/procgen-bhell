import { System, Not } from "ecsy";
import { EnemyComponent } from "../components/enemy";
import { LocRotComponent, BodyComponent, PhysicsComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { DamageableComponent } from "../components/damage"
import { Vector3 } from "../ecs_types"
import { PlayerComponent } from "../components/player";
import { AIChasePlayerComponent, AITargetPlayerComponent } from "../components/ai_control";
import { FireControlComponent, GunComponent, ProxyMineComponent } from "../components/weapons";
import { WaveMemberComponent } from "../components/wave";

export class EnemySystem extends System {
    spawn_enemy(enemyEntity,level){
        const r = Math.random()
        // TODO influence enemy selection based on wave
        console.log("spawning entity with level", level)
        enemyEntity.addComponent( LocRotComponent, { location: new Vector3((0.5 - Math.random()) * 20,5,(0.5 - Math.random()) * 20) } )
        if(r > 0.8 && level > 1){ // Chaser
            enemyEntity.addComponent( EnemyComponent, { score: 2 })
            enemyEntity.addComponent( AIChasePlayerComponent )
            enemyEntity.addComponent( ModelComponent, {
                material: "enemy:chaser",
                geometry: "sphere",
                scale: new Vector3(0.5,0.5,0.5),
            } )
            enemyEntity.addComponent( BodyComponent , { 
                bounds_type: BodyComponent.SPHERE_TYPE, 
                mass: 1 ,
                material: "chaser", // higher friction
            } )
            enemyEntity.addComponent( ProxyMineComponent )
            enemyEntity.addComponent( DamageableComponent, { health: 3 } )
        }else if(r > 0.7 && level >= 3){ // Sharp Shooter
            enemyEntity.addComponent( AITargetPlayerComponent, { predict: true, max_distance: 30 } )
            enemyEntity.addComponent( GunComponent, { rate_of_fire: 2, bullet_damage: 2,bullet_material: "bullet-shooter2", bullet_speed: 5 } )
            enemyEntity.addComponent( FireControlComponent )
            enemyEntity.addComponent( ModelComponent, {material: "enemy:shooter2"} )
            enemyEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 1 } )
            enemyEntity.addComponent( DamageableComponent, { health: 3 } )
            enemyEntity.addComponent( EnemyComponent, { score: 2 })
        }else if(r > 0.65 && level >= 5){ // Big Daddy
            enemyEntity.addComponent( AITargetPlayerComponent, { predict: true, max_distance: 30 } )
            enemyEntity.addComponent( GunComponent, { 
                rate_of_fire: 3, 
                bullet_damage: 10, 
                bullet_material: "default_bullet", 
                bullet_speed: 2.5 ,
                bullet_scale: new Vector3(0.4,0.4,0.4),
                bullet_mass: 50,
                bullet_sound: "big-bullet-fire",
            } )
            enemyEntity.addComponent( FireControlComponent )
            enemyEntity.addComponent( ModelComponent, {material: "enemy:shooter3", scale: new Vector3(1.5,1.5,1.5) } )
            enemyEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 5, bounds: new Vector3(1.5,1.5,1.5) } )
            enemyEntity.addComponent( DamageableComponent, { health: 8 } )
            enemyEntity.addComponent( EnemyComponent, { score: 3 })
        }else{ // Grunt
            enemyEntity.addComponent( AITargetPlayerComponent )
            enemyEntity.addComponent( FireControlComponent )
            enemyEntity.addComponent( GunComponent, { rate_of_fire: 1 , bullet_damage: 0.5 } )
            enemyEntity.addComponent( ModelComponent, {material: "enemy:shooter"} )
            enemyEntity.addComponent( BodyComponent , { bounds_type: BodyComponent.BOX_TYPE, mass: 1 } )
            enemyEntity.addComponent( DamageableComponent, { health: 2 } )
            enemyEntity.addComponent( EnemyComponent, { score: 1 })
        }
    }

    execute(delta,time){

        this.queries.uninitialized.results.forEach( e => {
            const wave = e.getComponent(WaveMemberComponent)
            this.spawn_enemy(e,wave.wave)
        })

        // TODO only give player points for enemies killed by their bullets?
        // would need to flag bullet ownership as player
        if(this.queries.player.results.length > 0){
            const player = this.queries.player.results[0]
            const player_c = player.getMutableComponent(PlayerComponent)

            if(this.queries.player.results.length > 0){
                this.queries.active.removed.forEach( e => {
                    const enemy = e.getRemovedComponent(EnemyComponent)
                    if(enemy){ // not sure why this is sometimes undefined
                        player_c.score += enemy.score
                    }
                })
            }
        }
    }
}

EnemySystem.queries = {
    uninitialized: {
        components: [WaveMemberComponent,Not(EnemyComponent)]
    },
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