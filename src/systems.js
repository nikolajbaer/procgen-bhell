import { System } from "ecsy";
import { PhysicsComponent, MeshComponent } from "./components.js"


export class PhysicsSystem extends System {
    execute(delta){
        //this.world.step(delta)
    }
}

PhysicsSystem.queries = {
  entities: { components: [PhysicsComponent] }
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