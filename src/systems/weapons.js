import { System, Not } from "ecsy";
import {  GunComponent, BulletComponent, FireControlComponent } from "../components/weapons"
import { PhysicsComponent,BodyComponent, LocRotComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import * as CANNON from "cannon-es"
import * as THREE from "three"
import { Vector3, Vector3Type } from "../ecs_types";

export class WeaponsSystem extends System {

    spawn_bullet(gun,aim,vel_vec,live_to){
        const bulletEntity = this.world.createEntity() 
        bulletEntity.addComponent(BodyComponent, {
            mass: 3,
            velocity: new Vector3(vel_vec.x,vel_vec.y,vel_vec.z),
            bounds: new Vector3(.2,.2,.2),
            body_type: BodyComponent.DYNAMIC,
            destroy_on_collision: false,
            track_collisions: true
        })
        bulletEntity.addComponent( LocRotComponent, {
            location: new Vector3(aim.from.x,aim.from.y,aim.from.z),
            //rotation: new Vector3(rot.x,rot.y,rot.z),
        })
        bulletEntity.addComponent( ModelComponent, {
            geometry: "sphere",
            material: "default_bullet",
            scale: new Vector3(.2,.2,.2),
            shadow: false,
        })
        bulletEntity.addComponent( BulletComponent, {
            live_to: live_to,
            damage: gun.bullet_damage,
        })
    }

    execute(delta,time){
        this.queries.shooters.results.forEach( e => {
            const gun = e.getMutableComponent(GunComponent)  
            const aim = e.getComponent(FireControlComponent)
            const body = e.getComponent(PhysicsComponent).body

            const aim_vec = new CANNON.Vec3(aim.at.x,aim.at.y,aim.at.z)
            aim_vec.normalize()
            const vel_vec = aim_vec.scale(gun.bullet_speed)

            // match speed with body, but this makes it way harder to aim!
            //const vel_vec = aim_vel.vadd(body.velocity)

            // Use Three to figure out our quaternion to point at
            // NOT WORKING
            const m = new THREE.Matrix4()
            m.lookAt(vel_vec.x,vel_vec.y,vel_vec.z)
            const rot = new THREE.Euler()
            rot.setFromRotationMatrix(m,'XYZ')

            if( gun.last_fire + gun.rate_of_fire < time && aim.fire1 ){
                this.spawn_bullet(gun,aim,vel_vec,gun.bullet_life + time)
                gun.last_fire = time
            }
        })
    }
}

WeaponsSystem.queries = {
    shooters: {
        components: [ GunComponent, FireControlComponent, PhysicsComponent ]
    }
}

export class AimSystem extends System {
    execute(delta, time){
        this.queries.shooters.results.forEach( e => {
            const body = e.getComponent(PhysicsComponent).body
            const aim = e.getMutableComponent(FireControlComponent)
            const vec = body.quaternion.vmult(new CANNON.Vec3(1,0,))
            vec.normalize()
            aim.at.set(vec.x,vec.y,vec.z)
            // TODO fire from tip of barrel in future
            aim.from.set(
                body.position.x + aim.at.x,
                body.position.y + .5 + aim.at.y,
                body.position.z + aim.at.z
            )
        })
    }
}
AimSystem.queries = {
    shooters: {
        components: [ GunComponent, PhysicsComponent ]
    }
}

export class BulletSystem extends System {
    execute(delta, time){
        this.queries.active.results.forEach( e => {
            const b = e.getMutableComponent(BulletComponent)
            if( b.live_to <= time){
                e.remove()
            }
        })
    }
}

BulletSystem.queries = {
    active: {
        components: [ BulletComponent ],
    }
}