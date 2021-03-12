import { System, Not } from "ecsy";
import {  GunComponent, BulletComponent, FireControlComponent, ProxyMineComponent } from "../components/weapons"
import { PhysicsComponent,BodyComponent, LocRotComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import * as CANNON from "cannon-es"
import * as THREE from "three"
import { Vector3, Vector3Type } from "../ecs_types";
import { PlayerSystem } from "./player";
import { DamageAppliedComponent } from "../components/damage";
import { ExplosionComponent } from "../components/effects";
import { PlayerComponent } from "../components/player";
import { SoundEffectComponent } from "../components/sound";

const UP = new THREE.Vector3(0,1,0)

export class WeaponsSystem extends System {

    spawn_bullet(gun,vel_vec,start_pos,live_to){
        const bulletEntity = this.world.createEntity() 
        const bullet_scale = (gun.bullet_scale == null)?new Vector3(.2,.2,.2):gun.bullet_scale
        // scoot bullet out by its z-scale plus a bit
        
        bulletEntity.addComponent(BodyComponent, {
            mass: 3,
            velocity: new Vector3(vel_vec.x,vel_vec.y,vel_vec.z),
            bounds: bullet_scale,
            body_type: BodyComponent.DYNAMIC,
            destroy_on_collision: true,
            track_collisions: true
        })
        bulletEntity.addComponent( LocRotComponent, {
            location: new Vector3(start_pos.x,start_pos.y,start_pos.z),
            //rotation: new Vector3(rot.x,rot.y,rot.z),
        })
        bulletEntity.addComponent( ModelComponent, {
            geometry: "sphere",
            material: gun.bullet_material,
            scale: bullet_scale, // Maybe scale bullet by damage amount
            shadow: false,
        })
        bulletEntity.addComponent( BulletComponent, {
            live_to: live_to,
            damage: gun.bullet_damage,
        })
    }

    barrel_aims(vel_vec,gun){
        const base_offset = vel_vec.scale(((gun.bullet_scale)?gun.bullet_scale.z:.2) * 2.1 ) // a bit farther than twice the bullet width
        const offset = body.quaternion.vmult(base_offset)

        // we need the offset to be pointing in the same direction as the aim vec

        if( gun.barrels == 1 ){ return [{vel:vel_vec,offset:base_offset}] }

        const v = new THREE.Vector3(vel_vec.x,vel_vec.y,vel_vec.z)
        const up = new THREE.Vector3(0,1,0)
        const a = (gun.barrel_spread * Math.PI/180)/gun.barrels
        const vecs = []

        for(var i = 0; i< gun.barrels; i++){
            const vb = new THREE.Vector3(v.x,v.y,v.z)
            vb.applyAxisAngle(up, -((a*gun.barrels)/2) + i*a)
            vecs.push({vel:new CANNON.Vec3(vb.x,vb.y,vb.z),offset:base_offset }) 
        }
        return vecs
    }

    fire(gun,body,time){
        // bullet heading/speed
        const vel_vec = body.quaternion.vmult(new CANNON.Vec3(gun.bullet_speed,0,0))
        // bullet radius 
        const br = (gun.bullet_scale!=undefined)?gun.bullet_scale.z:.2
        // go out so we don't collid with ourselves (NOTE ASsumption our radius is .5)
        const offset = body.quaternion.vmult(new CANNON.Vec3( br*2.1 + .5,0.5,0 ) )
        // perpendicular offset spacer for each barrel
        const p_offset = body.quaternion.vmult(new CANNON.Vec3(0,0,br*3)) 

        if(gun.barrels == 1){
            this.spawn_bullet(gun,vel_vec,body.position.vadd(offset),gun.bullet_life + time)
        }else{
            for(var i=0;i<gun.barrels;i++){
                const b_offset = offset.vadd(p_offset.scale(i-gun.barrels/2))
                const vb = new THREE.Vector3(vel_vec.x,vel_vec.y,vel_vec.z)
                if(gun.barrels > 2){ // only spread if we are more than 2 barrels.. otherwise weird
                    const a = -1 * (gun.barrel_spread * Math.PI/180)/gun.barrels * (i-gun.barrels/2)
                    vb.applyAxisAngle(UP, a)
                }

                this.spawn_bullet(gun,vb,body.position.vadd(b_offset),gun.bullet_life + time)
            }
        }
    }

    execute(delta,time){
        this.queries.shooters.results.forEach( e => {
            const gun = e.getMutableComponent(GunComponent)  
            const control = e.getComponent(FireControlComponent)
            const body = e.getComponent(PhysicsComponent).body

            if( gun.last_fire + gun.rate_of_fire < time && control.fire1 ){                    
                this.fire(gun,body,time)
                gun.last_fire = time
                e.addComponent( SoundEffectComponent, { sound: gun.bullet_sound })
            }
        })
    }
}

WeaponsSystem.queries = {
    shooters: {
        components: [ GunComponent, FireControlComponent, PhysicsComponent ]
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
            const proxy = e.getMutableComponent(ProxyMineComponent)
            const body = e.getComponent(PhysicsComponent).body

            const distance = player_body.position.distanceTo(body.position)

            if( proxy.time != null ){
                if( proxy.time >= time ){
                    console.log(proxy.time,time,"proxy mine exploding!")
                    const damage = ( Math.pow(1 - (distance/proxy.damage_radius),2) ) * proxy.damage

                    if(player.hasComponent(DamageAppliedComponent)){
                        const dmg = player.getMutableComponent( DamageAppliedComponent)
                        dmg.amount += bullet_c.damage
                    }else{
                        player.addComponent(DamageAppliedComponent, { amount: damage }) 
                    }
                   
                    const explosion = this.world.createEntity()
                    explosion.addComponent( ExplosionComponent, { 
                        location: new Vector3(body.position.x,body.position.y,body.position.z),
                        size: proxy.damage_radius * 0.75,
                        duration: 0.7,
                    })
                    explosion.addComponent(SoundEffectComponent, { sound: "self-destruct" })
                    e.remove()
                }
            }else if( distance < proxy.trigger_distance ){
                console.log(distance,"is less than trigger",proxy.trigger_distance,"starting timer")
                proxy.time = time + proxy.delay
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
