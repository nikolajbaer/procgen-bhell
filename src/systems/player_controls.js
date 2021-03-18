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

        this.use_touch = 'ontouchstart' in window

        // KeyboarD Controls
        document.addEventListener("keydown", event => { actions[event.code] = true });
        window.addEventListener("keyup", event => { actions[event.code] = false });

        // Mouse / Touch aim controls
        const render = document.getElementById("render")
        if(!this.use_touch){
            render.addEventListener("mousemove", event => {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
                mouse.y = -( event.clientY / window.innerHeight) * 2 + 1
            })
            render.addEventListener("mousedown", event => { 
                console.log(event)
                actions["Mouse"+event.button] = true; 
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
                mouse.y = -( event.clientY / window.innerHeight) * 2 + 1
                event.preventDefault(); 
                return false; 
            })
            window.addEventListener("mouseup", event => { 
                actions["Mouse"+event.button] = false; 
                event.preventDefault(); 
                return false; 
            })
            // don't show the context menu (use RMB for game controls)
            render.addEventListener("contextmenu", event => {
                event.preventDefault()
                return false
            })
        }else{
                // Touch Events
            this.dpad_touch = null
            this.aim_touch = null
            render.addEventListener("touchstart", event => {
                // maybe both touches are simultaneous?
                Object.values(event.touches).forEach( t => {
                    if(t.clientX < window.innerWidth*0.2 && t.clientY > window.innerHeight * 0.8){
                        if(this.dpad_touch == null){
                            console.log("DPAD touch started with ",t.identifier)
                            this.dpad_touch = t.identifier
                            this.update_touch_dir({
                                x:event.touches[0].clientX,
                                y:event.touches[0].clientY
                            })
                        }
                    }else{
                        if(this.aim_touch == null){
                            console.log("Aim Touch started with ",t.identifier)
                            this.aim_touch = t.identifier
                            actions["Mouse0"] = true
                        }
                    }
                })
                event.preventDefault()
                return false
            })
            render.addEventListener("touchmove", event => {
                if(event.touches[this.dpad_touch]){
                    this.update_touch_dir({
                        x: event.touches[this.dpad_touch].clientX,
                        y: event.touches[this.dpad_touch].clientY
                    })
                }
                if(event.touches[this.aim_touch]){
                    mouse.x = (event.touches[this.aim_touch].clientX / window.innerWidth) * 2 - 1; 
                    mouse.y = -(event.touches[this.aim_touch].clientY / window.innerHeight) * 2 + 1
                }
                event.preventDefault()
                return false
            })
            window.addEventListener("touchend", event => {
                if(event.changedTouches[this.dpad_touch]){
                    console.log("Clearing dpad touch direction")
                    this.dpad_touch = null
                    this.direction = {x:0,y:0}
                }
                if(event.changedTouches[this.aim_touch]){
                    console.log("Clearing aim touch")
                    this.aim_touch = null 
                    actions["Mouse0"] = false
                }
                event.preventDefault()
                return false
            })
            window.addEventListener("touchcancel", event =>{
                console.log("Got touch cancel!")
            })
        } 
        this.direction = direction
        this.actions = actions
        this.mouse = mouse
    }

    update_touch_dir(pos){
        // convert to -1 to 1 in the 20% corner of the window
        const x = 1 - (pos.x/(window.innerWidth*0.2) * 2)
        const y = 1 - ((pos.y - window.innerHeight*0.8 )/(window.innerHeight*0.2) * 2)
        this.direction = {x:x,y:y}  
    }

    update_direction_from_keys(){
        this.direction = {x:0,y:0}
        if(this.actions["ArrowUp"] || this.actions["KeyW"]){ this.direction.y = 1
        }else if(this.actions["ArrowDown"] || this.actions["KeyS"]){ this.direction.y = -1 }

        if(this.actions["ArrowLeft"] || this.actions["KeyA"]){ this.direction.x = 1
        }else if(this.actions["ArrowRight"] || this.actions["KeyD"]){ this.direction.x = -1 }
    }

    execute(delta){
        if(!this.use_touch){
            this.update_direction_from_keys()
        }
        
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

