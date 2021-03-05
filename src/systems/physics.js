import { System, Not } from "ecsy";
import { PhysicsComponent, LocRotComponent, BodyComponent } from "../components/physics.js"
import { MeshComponent } from "../components/render.js"
import * as CANNON from "cannon-es"
import { BulletComponent } from "../components/weapons.js";
import { DamageableComponent, DamageAppliedComponent } from "../components/damage.js";

// inspired by https://github.com/macaco-maluco/thermal-runway/blob/master/src/systems/PhysicsSystem.ts
const PHYSICS_MATERIALS = {
    "ground": new CANNON.Material("ground"),
    "default": new CANNON.Material(),
    "chaser": new CANNON.Material({name:"chaser",friction:1.0})
}

export class PhysicsSystem extends System {
    init() {
        this.world = new CANNON.World()
        this.world.gravity.set(0, -1, 0)

        window.world = this.world
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
        })
        body1.linearDamping = 0.01
        body1.addShape(shape)
        body1.ecsy_entity = e // back reference for processing collisions
        if( body.track_collisions){ 
            body1.addEventListener("collide", event => {
                if(event.body.ecsy_entity.hasComponent(BulletComponent)){
                    this.handleBulletCollision(event.body.ecsy_entity,event.target.ecsy_entity) 
                }else if(event.target.ecsy_entity.hasComponent(BulletComponent)){
                    this.handleBulletCollision(event.target.ecsy_entity,event.body.ecsy_entity) 
                }
            })
        }
        this.world.addBody(body1) 
        
        e.addComponent(PhysicsComponent, { body: body1 })

    }

    execute(delta){
        if(!this.world) return

        // first intialize any uninitialized bodies
        this.queries.uninitialized.results.forEach( e => {
            this.create_physics_body(e)
        })

        // todo then remove any removed bodies
        this.queries.remove.results.forEach( e => {
            const body = e.getComponent(PhysicsComponent).body
            body.ecsy_entity = null // clear back reference
            this.world.removeBody(body)
            e.removeComponent(PhysicsComponent)
        })

        this.world.step(1/60,delta)
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