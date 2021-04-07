import { System, Not } from "ecsy";
import { PhysicsComponent, LocRotComponent, BodyComponent, RotatorComponent } from "../components/physics.js"
import { CameraShakeComponent, MeshComponent, ModelComponent } from "../components/render.js"
import * as CANNON from "cannon-es"
import { BulletComponent, GunComponent } from "../components/weapons.js";
import { DamageableComponent, DamageAppliedComponent, HealableComponent, HealthAppliedComponent } from "../components/damage.js";
import { GunPickupComponent, HealthComponent } from "../components/pickup.js";
import { InventoryComponent } from "../components/inventory.js";
import { PlayerComponent } from "../components/player.js";
import { GroundComponent } from "../components/map";
import { ShakeGroundComponent } from "../components/enemy.js";

// TODO explore https://github.com/ashconnell/physx-js

// inspired by https://github.com/macaco-maluco/thermal-runway/blob/master/src/systems/PhysicsSystem.ts
const PHYSICS_MATERIALS = {
    "ground": new CANNON.Material("ground"),
    "default": new CANNON.Material(),
    "chaser": new CANNON.Material({name:"chaser",friction:1.0}),
    "player": new CANNON.Material({name:"player",friction:0.0}),
    "mover": new CANNON.Material({name:"mover",friction:0.0}),
}

export class PhysicsSystem extends System {
    init() {
        this.physics_world = new CANNON.World()
        this.physics_world.gravity.set(0, -1, 0)

        window.physics_world = this.phsyics_world
    }

    create_physics_body(e){
        const body = e.getComponent(BodyComponent)
        const locrot = e.getComponent(LocRotComponent)

        const quat = new CANNON.Quaternion()
        quat.setFromEuler(locrot.rotation.x,locrot.rotation.y,locrot.rotation.z)

        let shape = null
        switch(body.bounds_type){
            case BodyComponent.BOX_TYPE:
                shape = new CANNON.Box(new CANNON.Vec3(body.bounds.x/2,body.bounds.y/2,body.bounds.z/2))
                break;
            case BodyComponent.PLANE_TYPE:
                shape = new CANNON.Plane()
                break;
            default:
                shape = new CANNON.Sphere(body.bounds.x/2)
                break;
        }
        const mat = PHYSICS_MATERIALS[body.material]
        const body1  = new CANNON.Body({
            mass: body.mass, //mass
            material: mat,
            position: new CANNON.Vec3(locrot.location.x,locrot.location.y,locrot.location.z),
            quaternion: quat,
            type: body.body_type,
            velocity: new CANNON.Vec3(body.velocity.x,body.velocity.y,body.velocity.z),
            fixedRotation: body.fixed_rotation
        })
        if( body.fixed_rotation ){
            body1.updateMassProperties()
        }
        body1.linearDamping = 0.01
        body1.addShape(shape)
        body1.ecsy_entity = e // back reference for processing collisions
        if( body.track_collisions){ 
            body1.addEventListener("collide", event => {
                // TODO Would like a nicer way to do this
                if(event.body.ecsy_entity.hasComponent(BulletComponent)){
                    this.handleBulletCollision(event.body.ecsy_entity,event.target.ecsy_entity) 
                }else if(event.target.ecsy_entity.hasComponent(BulletComponent)){
                    this.handleBulletCollision(event.target.ecsy_entity,event.body.ecsy_entity) 
                }

                if(event.body.ecsy_entity.hasComponent(HealthComponent)){
                    this.handleHealthCollision(event.body.ecsy_entity,event.target.ecsy_entity) 
                }else if(event.target.ecsy_entity.hasComponent(HealthComponent)){
                    this.handleHealthCollision(event.target.ecsy_entity,event.body.ecsy_entity) 
                }  
                
                if(event.body.ecsy_entity.hasComponent(GunPickupComponent)){
                    this.handleGunPickupCollision(event.body.ecsy_entity,event.target.ecsy_entity) 
                }else if(event.target.ecsy_entity.hasComponent(GunPickupComponent)){
                    this.handleGunPickupCollision(event.target.ecsy_entity,event.body.ecsy_entity) 
                }

                if(event.body.ecsy_entity.hasComponent(GroundComponent)){
                    if(event.target.ecsy_entity.hasComponent(ShakeGroundComponent)){
                        event.target.ecsy_entity.addComponent(CameraShakeComponent) 
                        event.target.ecsy_entity.removeComponent(ShakeGroundComponent) 
                    }
                }else if(event.target.ecsy_entity.hasComponent(GroundComponent)){
                    if(event.body.ecsy_entity.hasComponent(ShakeGroundComponent)){
                        event.body.ecsy_entity.addComponent(CameraShakeComponent) 
                        event.body.ecsy_entity.removeComponent(ShakeGroundComponent) 
                    }
                }
            })
        }
        this.physics_world.addBody(body1) 
        
        e.addComponent(PhysicsComponent, { body: body1 })

    }

    execute(delta,time){
        if(!this.physics_world) return

        // first intialize any uninitialized bodies
        this.queries.uninitialized.results.forEach( e => {
            this.create_physics_body(e)
        })

        // todo then remove any removed bodies
        this.queries.remove.results.forEach( e => {
            const body = e.getComponent(PhysicsComponent).body
            body.ecsy_entity = null // clear back reference
            this.physics_world.removeBody(body)
            e.removeComponent(PhysicsComponent)
        })

        this.queries.rotators.added.forEach( e => {
            const body = e.getComponent(PhysicsComponent).body
            const rot = e.getComponent(RotatorComponent)
            body.angularVelocity.set(0,rot.a_per_s,0)
        })

        const t0 = performance.now()
        this.physics_world.step(1/60,delta)
        window.perf_phys = performance.now() - t0
    }

    handleBulletCollision(bullet,damageable){
        if( ! damageable.hasComponent(DamageableComponent)){
            return
        }
        const bullet_c = bullet.getComponent(BulletComponent)
        if( damageable.hasComponent(DamageAppliedComponent)){
            const d_applied = damageable.getMutableComponent(DamageAppliedComponent)
            d_applied.amount += bullet_c.damage
        }else{
            damageable.addComponent(DamageAppliedComponent, { amount: bullet_c.damage }) 
        }
        bullet.remove()
    }

    handleHealthCollision(health_pickup,damageable){
        if( !damageable.hasComponent(HealableComponent)){
            return
        }
        const health_c = health_pickup.getComponent(HealthComponent)
        if( damageable.hasComponent(HealthAppliedComponent)){
            const h_applied = damageable.getMutableComponent(HealthAppliedComponent)
            h_applied.amount += health_c.amount
        }else{
            damageable.addComponent(HealthAppliedComponent, { amount: health_c.amount }) 
        }
        health_pickup.remove()
    }
    
    handleGunPickupCollision(gun_pickup,player){
        if( !player.hasComponent(GunComponent) || !player.hasComponent(PlayerComponent)){
            return
        }
        const new_gun = gun_pickup.getComponent(GunComponent)
        const pgun = player.getMutableComponent(GunComponent)
        pgun.copy(new_gun)

        // Clear out model and physics and render of gun pickup
        const inventory_gun = this.world.createEntity()
        inventory_gun.addComponent( GunComponent, new_gun )
        inventory_gun.addComponent( InventoryComponent ) 
        gun_pickup.remove()
    }
 }

PhysicsSystem.queries = {
    uninitialized: { components: [LocRotComponent, BodyComponent, Not(PhysicsComponent)]},
    entities: { 
        components: [PhysicsComponent] ,
        listen: {
            removed: true
        }
    },
    remove: {
        components: [PhysicsComponent,Not(BodyComponent)]
    },
    rotators: {
        components: [RotatorComponent,PhysicsComponent],
        listen: {
            added: true
        }
    }
};


export class PhysicsMeshUpdateSystem extends System {
    execute(delta){
        let entities = this.queries.entities.results;
        entities.forEach( e => {
            let body = e.getComponent(PhysicsComponent).body
            let mesh = e.getComponent(MeshComponent).mesh
            mesh.position.copy(body.position)
            mesh.quaternion.copy(body.quaternion)
        })
    }
}

PhysicsMeshUpdateSystem.queries = {
  entities: { components: [PhysicsComponent, MeshComponent] }
};