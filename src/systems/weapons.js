import { System, Not } from "ecsy";
import {  GunComponent, BulletComponent, FireControlComponent, KamykazeComponent as ProxyMineComponent } from "../components/weapons"
import { PhysicsComponent,BodyComponent, LocRotComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import * as CANNON from "cannon-es"
import * as THREE from "three"
import { Vector3, Vector3Type } from "../ecs_types";
import { PlayerSystem } from "./player";
import { DamageAppliedComponent } from "../components/damage";
import { ExplosionComponent } from "../components/effects";
import { PlayerComponent } from "../components/player";

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

    barrel_aims(vel_vec,barrels){
        if( barrels == 1 ){ return [vel_vec] }

        const spread = (barrels == 2)?Math.PI/8:Math.PI/4;
        if(barrels > 5){ spread *= 1.5 }

        const v = new THREE.Vector3(vel_vec.x,vel_vec.y,vel_vec.z)
        const up = new THREE.Vector3(0,1,0)
        const a = spread/barrels
        const vecs = []

        for(var i = 0; i< barrels; i++){
            const vx = new THREE.Vector3(v.x,v.y,v.z)
            vx.applyAxisAngle(up,-spread/2 + i*a)
            vecs.push(new CANNON.Vec3(vx.x,vx.y,vx.z)) 
        }
        return vecs
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
                this.barrel_aims(vel_vec,gun.barrels).forEach( v => {
                    this.spawn_bullet(gun,aim,v,gun.bullet_life + time)
                }) 
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

export class ProxyMineSystem extends System {
    execute(delta, time){
        if( this.queries.player.results.length == 0 ){ return; }
        // CONSIDER refactor to TrackPlayerComponent  to minimize this query
        const player = this.queries.player.results[0]
        const player_body = player.getComponent(PhysicsComponent).body

        this.queries.active.results.forEach( e => {
            const kam = e.getMutableComponent(ProxyMineComponent)
            const body = e.getComponent(PhysicsComponent).body

            const distance = player_body.position.distanceTo(body.position)

            if( kam.time != null ){
                if( kam.time >= time ){
                    console.log(kam.time,time,"proxy mine exploding!")
                    const damage = ( Math.pow(1 - (distance/kam.damage_radius),2) ) * kam.damage

                    if(player.hasComponent(DamageAppliedComponent)){
                        const dmg = player.getMutableComponent( DamageAppliedComponent)
                        dmg.amount += bullet_c.damage
                    }else{
                        player.addComponent(DamageAppliedComponent, { amount: damage }) 
                    }
                   
                    const explosion = this.world.createEntity()
                    explosion.addComponent( ExplosionComponent, { 
                        location: new Vector3(body.position.x,body.position.y,body.position.z),
                        size: kam.damage_radius * 0.75,
                        duration: 0.7,
                    })
                    e.remove()
                }
            }else if( distance < kam.trigger_distance ){
                console.log(distance,"is less than trigger",kam.trigger_distance,"starting timer")
                kam.time = time + kam.delay
            }
        }) 
    }
}
ProxyMineSystem.queries = {
    active: {
        components: [ ProxyMineComponent, PhysicsComponent ]
    },
    player: {
        components: [ PlayerComponent, PhysicsComponent ]
    }
}
