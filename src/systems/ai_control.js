import { System, Not } from "ecsy";
import { EnemyComponent } from "../components/enemy";
import { AITargetPlayer } from "../components/ai_control"
import { PlayerComponent } from "../components/player"
import { BodyComponent, PhysicsComponent } from "../components/physics";
import * as CANNON from "cannon-es"
import * as THREE from "three"
import { FireControlComponent } from "../components/weapons";
import { Vector3 } from "../ecs_types"

export class AIControlSystem extends System {
    init(){
    }

    execute(delta,time){
        if(this.queries.player.results.length == 0){ 
            this.queries.active.results.forEach( e => {
                // if the player dies, stop shooting
                e.getMutableComponent(FireControlComponent).fire1 = false
            })
            return
        }
        const player = this.queries.player.results[0]
        const player_body = player.getComponent(PhysicsComponent).body

        this.queries.active.results.forEach( e => {
            const body = e.getComponent(PhysicsComponent).body
            const ai_target = e.getComponent(AITargetPlayer)
            const aim = e.getMutableComponent(FireControlComponent)

            // check lock distance 
            const distance = body.position.distanceTo(player_body.position)
            if(distance < ai_target.max_distance){
                // if within distance, slerp to player?
                const target = new THREE.Vector2(
                    player_body.position.x - body.position.x,
                    player_body.position.z - body.position.z
                )
                // TODO slerp ata speed rather than auto point
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -target.angle())
                aim.at = new Vector3(player_body.position.x,player_body.position.y,player_body.position.z)
                aim.from = new Vector3(body.position.x,body.position.y,body.position.z)
                aim.fire1 = true

                // quat slerp   
                // if within min_angle distance, fire?
            }else{
                aim.fire1 = false
            }
        })
    }
}

AIControlSystem.queries = {
    active: {
        components: [EnemyComponent,AITargetPlayer,PhysicsComponent,FireControlComponent]
    },
    player: { 
        components: [PlayerComponent,PhysicsComponent]
    }
}