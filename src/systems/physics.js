import { System, Not } from "ecsy";
import { PhysicsComponent, LocRotScaleComponent, BodyComponent } from "../components/physics.js"
import { MeshComponent } from "../components/render.js"
import * as CANNON from "cannon-es"

// inspired by https://github.com/macaco-maluco/thermal-runway/blob/master/src/systems/PhysicsSystem.ts
const MATERIALS = {
    "ground": new CANNON.Material("ground"),
    "default": new CANNON.Material(),
}

export class PhysicsSystem extends System {
    init() {
        this.world = new CANNON.World()
        this.world.gravity.set(0, -10, 0)
    }

    execute(delta){
        if(!this.world) return

        // first intialize any uninitialized bodies
        this.queries.uninitialized.results.forEach( e => {
            const body = e.getComponent(BodyComponent)
            const locrot = e.getComponent(LocRotScaleComponent)

            const quat = new CANNON.Quaternion()
            quat.setFromEuler(locrot.rotx,locrot.roty,locrot.rotz)

            let shape = null
            switch(body.bounds_type){
                case BodyComponent.BOX_TYPE:
                    shape = new CANNON.Box(new CANNON.Vec3(body.x/2,body.y/2,body.z/2))
                    break;
                case BodyComponent.PLANE_TYPE:
                    shape = new CANNON.Plane()
                    break;
                default:
                    shape = new CANNON.Sphere(body.x/2)
                    break;
            }
            const mat = MATERIALS[body.material]
            const body1  = new CANNON.Body({
                mass:body.mass, //mass
                material: mat,
                position: new CANNON.Vec3(locrot.x,locrot.y,locrot.z),
                quaternion: quat,
                type: body.body_type,
            })
            console.log(body1)
            body1.linearDamping = 0.01
            body1.addShape(shape)
            this.world.addBody(body1) 
            
            e.addComponent(PhysicsComponent, { body: body1 })
        })

        // todo then remove any removed bodies

        this.world.step(delta/1000)
    }
}

PhysicsSystem.queries = {
    uninitialized: { components: [LocRotScaleComponent, BodyComponent, Not(PhysicsComponent)]},
    entities: { components: [PhysicsComponent] },
    removed: { components: [PhysicsComponent] },
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