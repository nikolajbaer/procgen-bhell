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
        let direction = new Vector2(0,0) 

        // KeyboarD Controls
        document.addEventListener("keydown", event => { actions[event.code] = true });
        window.addEventListener("keyup", event => { actions[event.code] = false });

        // Mouse / Touch aim controls
        const render = document.getElementById("render")
        render.addEventListener("pointermove", event => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
            mouse.y = -( event.clientY / window.innerHeight) * 2 + 1
        })
        render.addEventListener("pointerdown", event => { 
            actions["Mouse"+event.button] = true; 
            event.preventDefault(); 
            return false; 
        })
        window.addEventListener("pointerup", event => { 
            actions["Mouse"+event.button] = false; 
            event.preventDefault(); 
            return false; 
        })
        // don't show the context menu (use RMB for game controls)
        render.addEventListener("contextmenu", event => {
            event.preventDefault()
            return false
        })

        // TODO Mobile on-screen controls 
        // CONSIDER jsut record the vector and use that
        window.addEventListener("game_move_dir", event => {
            console.log("Updating direction ")
            this.direction.x = event.detail.vector.x
            this.direction.y = event.detail.vector.y
        })
        // can we detect if we have a mouse?

        this.direction = direction
        this.actions = actions
        this.mouse = mouse
    }

    update_direction(){
        if(this.actions["ArrowUp"] || this.actions["KeyW"]){ this.direction.y = 1
        }else if(this.actions["ArrowDown"] || this.actions["KeyS"]){ this.direction.y = -1 }

        if(this.actions["ArrowLeft"] || this.actions["KeyA"]){ this.direction.x = 1
        }else if(this.actions["ArrowRight"] || this.actions["KeyD"]){ this.direction.x = -1 }

    }

    execute(delta){
        this.update_direction()
        
        let mouse_cast_target = null
        this.queries.mouse_raycast.results.forEach( e => {
            const caster = e.getMutableComponent(RayCastTargetComponent)
            caster.mouse.x = this.mouse.x
            caster.mouse.y = this.mouse.y
            mouse_cast_target = new CANNON.Vec3(caster.location.x,caster.location.y,caster.location.z)
        })

        this.queries.controlled.results.forEach( e => {
            // WASD/Arrow movement
            const vel = new CANNON.Vec3(this.direction.x,0,this.direction.y)
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

