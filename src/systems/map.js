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

    create_room(x,z,w,h,doors){
        // ISSUE - kinematic bodies don't collide.
        const T = 2 // wall thickness
        this.create_wall(x-w/2,z,T,h) // left
        this.create_wall(x+w/2,z,T,h) // right
        this.create_wall(x,z+h/2,w,T) // top
        this.create_wall(x,z-h/2,w,T) // bottom
    }

    create_wall(x,z,w,h){
        const H = 5 // wall height
        const e = this.world.createEntity()
        e.addComponent( BodyComponent, {
            mass: 0,
            bounds_type: BodyComponent.BOX_TYPE,
            bounds: {x:w,y:H,z:h},
            material: "ground",
         })
        e.addComponent( LocRotComponent, { location: {x:x,y:H/2,z:z} } )
        e.addComponent( ModelComponent, { geometry: "box", material: "ground", scale: new Vector3(w,H,h) })
    }

    execute(delta,time){
        if(this.queries.ground.results.length == 0){
            this.create_ground()
            this.create_room(0,0,75,60,[])
        }

        // TODO walls?
    }
}

MapSystem.queries = {
    ground: {
        components: [GroundComponent]
    }
}