import { System, Not } from "ecsy";
import { GroundComponent } from "../components/map";
import { BodyComponent, LocRotComponent } from "../components/physics"
import { ModelComponent, RayCastTargetComponent } from "../components/render"
import { Vector3 } from "../ecs_types"

export class MapSystem extends System {
    init(){
        this.respawn_delay = 1  // non null for immediate start
    }

    create_ground(){
        const groundEntity = this.world.createEntity()
        groundEntity.addComponent( BodyComponent, {
            mass: 0,
            bounds_type: BodyComponent.PLANE_TYPE,
            body_type: BodyComponent.STATIC,
            material: "ground"
        })
        groundEntity.addComponent( LocRotComponent, { rotation: new Vector3(-Math.PI/2,0,0) } )
        groundEntity.addComponent( ModelComponent, { geometry: "ground", material: "ground" })
        groundEntity.addComponent( RayCastTargetComponent )
        groundEntity.addComponent( GroundComponent )
    }

    execute(delta,time){
        if(this.queries.ground.results.length == 0){
            this.create_ground()
        }

        // TODO walls?
    }
}

MapSystem.queries = {
    ground: {
        components: [GroundComponent]
    }
}