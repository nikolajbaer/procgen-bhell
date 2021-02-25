import { System, Not } from "ecsy";
import { Vector2 } from "three";
import * as CANNON from "cannon-es"
import { PhysicsComponent } from "../components/physics";
import { ControlsComponent } from "../components/controls";

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

        //this.raycaster = new THREE.Raycaster();
        this.actions = actions
        this.mouse = mouse
    }

    execute(delta){

        this.queries.controlled.results.forEach( e => {
            // WASD/Arrow movement
            const vel = new CANNON.Vec3(0,0,0)
            if(this.actions["ArrowUp"] || this.actions["KeyW"]){ vel.z = 1
            }else if(this.actions["ArrowDown"] || this.actions["KeyS"]){ vel.z = -1 }

            if(this.actions["ArrowLeft"] || this.actions["KeyA"]){ vel.x = 1
            }else if(this.actions["ArrowRight"] || this.actions["KeyD"]){ vel.x = -1 }

            const body = e.getComponent(PhysicsComponent).body
            body.velocity = vel.scale(SPEED)

            // Point in Mouse Direction where our mouse projects to the ground
            /*
            raycaster.setFromCamera( mouse, camera );
            const intersects = raycaster.intersectObjects( [groundMesh] )
            if(intersects.length){
                const target = new THREE.Vector2(
                    intersects[0].point.x - body1.position.x,
                    intersects[0].point.z - body1.position.z
                )
                body1.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -target.angle())
            }
            */

            /*
            camera.position.copy(new THREE.Vector3(
                mesh1.position.x + CAM_OFFSET.x,
                mesh1.position.y + CAM_OFFSET.y,
                mesh1.position.z + CAM_OFFSET.z,
            ))
            */

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
    }
}

