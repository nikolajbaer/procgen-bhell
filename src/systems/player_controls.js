import { System, Not } from "ecsy";
import { TOUCH, Vector2 } from "three";
import * as CANNON from "cannon-es"
import { PhysicsComponent } from "../components/physics";
import { FireControlComponent } from "../components/weapons";
import { RayCastTargetComponent } from "../components/render";
import * as THREE from "three"
import { PlayerComponent } from "../components/player";

const SPEED = 1 
const TOUCH_PERCENTAGE = 0.2 // percent of screen for touch rects

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

            // track two rects in the lower left/right
            // where we do dpad and aim controls for touch
            this.update_touch_rects()
            window.addEventListener('resize', () => {
                this.update_touch_rects()
            })

            render.addEventListener("touchstart", event => {
                // maybe both touches are simultaneous?
                Object.values(event.touches).forEach( t => {
                    if(t.clientX < this.dpad_rect.x && t.clientY > this.dpad_rect.y){
                        if(this.dpad_touch == null){
                            console.log("DPAD touch started with ",t.identifier)
                            this.dpad_touch = t.identifier
                            this.update_touch_dpad(event.touches[0])
                        }
                    }else if(t.clientX > this.aim_rect.x && t.clientY > this.aim_rect.y){
                        if(this.aim_touch == null){
                            console.log("Aim Touch started with ",t.identifier)
                            this.aim_touch = t.identifier
                            actions["Mouse0"] = true
                            this.update_touch_aim(event.touches[0])
                        }
                    }
                })
                event.preventDefault()
                return false
            })
            render.addEventListener("touchmove", event => {
                if(event.touches[this.dpad_touch]){
                    this.update_touch_dpad(event.touches[this.dpad_touch])
                }
                if(event.touches[this.aim_touch]){
                    this.update_touch_aim(event.touches[this.aim_touch])
                }
                event.preventDefault()
                return false
            })
            const handleTouchEnd = (event) => {
                if(event.changedTouches[this.dpad_touch]){
                    console.log("clearing dpad touch",this.dpad_touch)
                    this.dpad_touch = null
                    this.direction = {x:0,y:0}
                }
                if(event.changedTouches[this.aim_touch]){
                    console.log("clearing aim touch",this.aim_touch)
                    this.aim_touch = null 
                    actions["Mouse0"] = false
                }
                event.preventDefault()
                return false
            }
            window.addEventListener("touchend",handleTouchEnd)
            window.addEventListener("touchcancel",handleTouchEnd)
        } 
        this.direction = direction
        this.actions = actions
        this.mouse = mouse
    }

    update_touch_rects(){
        // relative touch control surfaces: e.g. 20% left corner and 20% right corner
        const inv = 1 - TOUCH_PERCENTAGE 
        const w = window.innerWidth*TOUCH_PERCENTAGE
        const h = window.innerHeight * TOUCH_PERCENTAGE 
        this.dpad_rect = {
            x: window.innerWidth*TOUCH_PERCENTAGE,
            y:window.innerHeight*inv,
            w:w,h:h
        }
        this.aim_rect = {
            x:window.innerWidth*inv,
            y:window.innerHeight*inv,
            w:w,h:h
        }
    }

    get_pad_vector(touch,rect){
        const mid = {x:rect.x + rect.w/2, y: rect.y + rect.h/2}
        return {x: mid.x - touch.clientX, y: mid.y - touch.clientY}
    }

    update_touch_dpad(touch){
        // convert to -1 to 1 in the 20% corner of the window
        const v = this.get_pad_vector(touch,this.dpad_rect)
        console.log("dpad",v,{x:touch.clientX,y:touch.clientY},this.dpad_rect)
        this.direction = v
    }

    update_touch_aim(touch){
        const v = this.get_pad_vector(touch,this.aim_rect)
        console.log("aim",v,{x:touch.clientX,y:touch.clientY},this.aim_rect)
        this.mouse.x = v.x; 
        this.mouse.y = v.y
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

