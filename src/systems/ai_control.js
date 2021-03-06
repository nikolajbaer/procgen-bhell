import { System, Not } from "ecsy";
import { EnemyComponent } from "../components/enemy";
import { AIChasePlayerComponent, AITargetPlayerComponent } from "../components/ai_control"
import { PlayerComponent } from "../components/player"
import { BodyComponent, PhysicsComponent } from "../components/physics";
import * as CANNON from "cannon-es"
import * as THREE from "three"
import { FireControlComponent } from "../components/weapons";
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
            const aim = e.getMutableComponent(FireControlComponent)

            // check lock distance 
            const distance = body.position.distanceTo(player_body.position)
            if(distance < ai_target.max_distance){
                this.look_at(body,player_body.position)

                aim.at = new Vector3(player_body.position.x,player_body.position.y,player_body.position.z)
                aim.from = new Vector3(body.position.x,body.position.y,body.position.z)

                aim.fire1 = true
               
            }else{
                aim.fire1 = false
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
        components: [EnemyComponent,AITargetPlayerComponent,PhysicsComponent,FireControlComponent]
    },
    chasers: {
        components: [EnemyComponent,PhysicsComponent,AIChasePlayerComponent]
    },
    player: { 
        components: [PlayerComponent,PhysicsComponent]
    }
}