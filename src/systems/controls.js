import { System, Not } from "ecsy";
import { Vector2 } from "three";
import * as CANNON from "cannon-es"
import { PhysicsComponent } from "../components/physics";
import { ControlsComponent } from "../components/controls";
import { RayCastTargetComponent } from "../components/render";
import { RaycastResult } from "cannon-es";
import * as THREE from "three"

const SPEED = .25 

export class ControlsSystem extends System {
    init() {
        let mouse = new Vector2(0,0)
        let actions = {}
        document.addEventListener("keydown", event => { actions[event.code] = true });
        document.addEventListener("keyup", event => { actions[event.code] = false });
        document.addEventListener("mousemove", event => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
            mouse.y = -( event.clientY / window.innerHeight) * 2 + 1
        })
        document.addEventListener("mousedown", event => { actions["Mouse"+event.button] = true })
        document.addEventListener("mouseup", event => { actions["Mouse"+event.button] = false })

        this.actions = actions
        this.mouse = mouse
    }

    execute(delta){

        let mouse_cast_target = null
        this.queries.mouse_raycast.results.forEach( e => {
            const caster = e.getMutableComponent(RayCastTargetComponent)
            caster.mx = this.mouse.x
            caster.my = this.mouse.y
            mouse_cast_target = new CANNON.Vec3(caster.x,caster.y,caster.z)
        })

        this.queries.controlled.results.forEach( e => {
            // WASD/Arrow movement
            const vel = new CANNON.Vec3(0,0,0)
            if(this.actions["ArrowUp"] || this.actions["KeyW"]){ vel.z = 1
            }else if(this.actions["ArrowDown"] || this.actions["KeyS"]){ vel.z = -1 }

            if(this.actions["ArrowLeft"] || this.actions["KeyA"]){ vel.x = 1
            }else if(this.actions["ArrowRight"] || this.actions["KeyD"]){ vel.x = -1 }

            const body = e.getComponent(PhysicsComponent).body
            body.velocity = vel.scale(SPEED)

            if(mouse_cast_target){
                const target = new THREE.Vector2(
                    mouse_cast_target.x - body.position.x,
                    mouse_cast_target.z - body.position.z
                )
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -target.angle())
            }

            // Primary Fire
            if(this.actions["Mouse0"]){
            }
            // Secondary Fire
            if(this.actions["Mouse1"]){
            }

        })

    }
}

ControlsSystem.queries = {
    controlled: {
        components: [ControlsComponent,PhysicsComponent],
    },
    mouse_raycast: {
        components: [ RayCastTargetComponent ]
    }
}

