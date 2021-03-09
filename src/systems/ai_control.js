import { System, Not } from "ecsy";
import { EnemyComponent } from "../components/enemy";
import { AIChasePlayerComponent, AITargetPlayerComponent } from "../components/ai_control"
import { PlayerComponent } from "../components/player"
import { BodyComponent, PhysicsComponent } from "../components/physics";
import * as CANNON from "cannon-es"
import * as THREE from "three"
import { FireControlComponent, GunComponent } from "../components/weapons";
import { Vector3 } from "../ecs_types"


export class AIControlSystem extends System {
    look_at(body,position){
        const target = new THREE.Vector2(
            position.x - body.position.x,
            position.z - body.position.z
        )
        body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -target.angle())
        return target
    }

    predict_target(start_pos,target_pos,vel_target,vel_intercept){
        // From https://stackoverflow.com/a/2249237
        const a = Math.pow(vel_target.x,2)  + Math.pow(vel_target.z,2) - Math.pow(vel_intercept,2)
        const b = 2 *  ( vel_target.x * (target_pos.x - start_pos.x) + 
                         vel_target.z * (target_pos.z - start_pos.z) )
        const c = Math.pow(target_pos.x - start_pos.x,2) + Math.pow(target_pos.z - start_pos.z,2)
        const disc = Math.pow(b,2) - (4 * a * c)

        // If not possible to hit, return null, and we just aim at our target
        if(disc < 0){ 
            return null 
        }
        const t1 = ( -b + Math.sqrt(disc)) / (2 * a)
        const t2 = ( -b - Math.sqrt(disc)) / (2 * a)
        let t  = ( t1 < 0 || (t2 >= 0 && t1 > t2) )?t2:t1;

        const aim = new Vector3(
            t * vel_target.x + target_pos.x,
            0,
            t * vel_target.z + target_pos.z,
        )

        // return predicted point to aim at
        return aim
    }

    execute(delta,time){
        if(this.queries.player.results.length == 0){ 
            this.queries.shooters.results.forEach( e => {
                // if the player dies, stop shooting
                e.getMutableComponent(FireControlComponent).fire1 = false
            })
            return
        }
        const player = this.queries.player.results[0]
        const player_body = player.getComponent(PhysicsComponent).body

        // TODO consider how to break out AI Behaviours into different components (or systems?)
        this.queries.shooters.results.forEach( e => {
            const body = e.getComponent(PhysicsComponent).body
            const ai_target = e.getComponent(AITargetPlayerComponent)
            const control = e.getMutableComponent(FireControlComponent)
            const gun = e.getComponent(GunComponent)

            // check lock distance 
            const distance = body.position.distanceTo(player_body.position)
            if(distance < ai_target.max_distance){
                let aim_at = player_body.position

                if( ai_target.predict ){
                    const predicted_target = this.predict_target(body.position,player_body.position,player_body.velocity,gun.bullet_speed)
                    if(predicted_target != null){
                        aim_at = predicted_target
                    }
                }

                this.look_at(body,aim_at)
                control.fire1 = true
               
            }else{
                control.fire1 = false
            }
        })

        this.queries.chasers.results.forEach( e => {
            const body = e.getComponent(PhysicsComponent).body
            const chase = e.getComponent(AIChasePlayerComponent)

            // check lock distance 
            const distance = body.position.distanceTo(player_body.position)
            if(distance < chase.max_distance && distance > chase.min_distance ){
                // this.look_at(body,player_body.position) // not necessary with sphere

                const dir = body.position.vsub(player_body.position)
                dir.normalize()
                const vel = new CANNON.Vec3(dir.x,0,dir.z)

                // CONSIDER moving these guys means we override motion from physics
                //body.velocity.set(vel.x,body.velocity.y,vel.z)
                body.applyForce(new CANNON.Vec3(-vel.x,0,-vel.z),new CANNON.Vec3(0,0.5,0))
            }else{
                body.velocity = body.velocity.scale(0.8)
            }
        })
    }
}

AIControlSystem.queries = {
    shooters: {
        components: [EnemyComponent,AITargetPlayerComponent,PhysicsComponent,FireControlComponent,GunComponent]
    },
    chasers: {
        components: [EnemyComponent,PhysicsComponent,AIChasePlayerComponent]
    },
    player: { 
        components: [PlayerComponent,PhysicsComponent]
    }
}