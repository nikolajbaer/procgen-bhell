import { System, Not } from "ecsy";
import { Vector2 } from "three";
import * as CANNON from "cannon-es"
import { PhysicsComponent } from "../components/physics";
import { FireControlComponent } from "../components/weapons";
import { RayCastTargetComponent } from "../components/render";
import * as THREE from "three"
import { PlayerComponent } from "../components/player";

const SPEED = 1 

export class PlayerControlsSystem extends System {
    init() {
        let mouse = new Vector2(0,0)
        let actions = {}

        document.addEventListener("keydown", event => { actions[event.code] = true });
        document.addEventListener("keyup", event => { actions[event.code] = false });

        const render = document.getElementById("render")
        render.addEventListener("pointermove", event => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
            mouse.y = -( event.clientY / window.innerHeight) * 2 + 1
        })
        render.addEventListener("pointerdown", event => { actions["Mouse"+event.button] = true; })
        render.addEventListener("pointerup", event => { actions["Mouse"+event.button] = false; })

        this.actions = actions
        this.mouse = mouse
    }

    execute(delta){

        let mouse_cast_target = null
        this.queries.mouse_raycast.results.forEach( e => {
            const caster = e.getMutableComponent(RayCastTargetComponent)
            caster.mouse.x = this.mouse.x
            caster.mouse.y = this.mouse.y
            mouse_cast_target = new CANNON.Vec3(caster.location.x,caster.location.y,caster.location.z)
        })

        this.queries.controlled.results.forEach( e => {
            // WASD/Arrow movement
            const vel = new CANNON.Vec3(0,0,0)
            if(this.actions["ArrowUp"] || this.actions["KeyW"]){ vel.z = 1
            }else if(this.actions["ArrowDown"] || this.actions["KeyS"]){ vel.z = -1 }

            if(this.actions["ArrowLeft"] || this.actions["KeyA"]){ vel.x = 1
            }else if(this.actions["ArrowRight"] || this.actions["KeyD"]){ vel.x = -1 }

            vel.normalize()

            const body = e.getComponent(PhysicsComponent).body
            body.velocity = vel.scale(SPEED)
            // to make wasd in accordance with body direction, 
            // swap x/z and flip left/right signs
            //body.velocity = body.quaternion.vmult(vel.scale(SPEED))

            if(mouse_cast_target){
                const target = new THREE.Vector2(
                    mouse_cast_target.x - body.position.x,
                    mouse_cast_target.z - body.position.z
                )
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -target.angle())
            }

            // Fire controls
            const control = e.getMutableComponent(FireControlComponent)
            control.fire1 = this.actions["Mouse0"]
            control.fire2 = this.actions["Mouse2"]

        })

    }
}

PlayerControlsSystem.queries = {
    controlled: {
        components: [FireControlComponent,PhysicsComponent,PlayerComponent],
    },
    mouse_raycast: {
        components: [ RayCastTargetComponent ]
    }
}
