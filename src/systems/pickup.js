import { System, Not } from "ecsy";
import { LocRotComponent, BodyComponent, RotatorComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { Vector3 } from "../ecs_types"
import { PickupComponent, GunPickupComponent, HealthComponent } from "../components/pickup";
import { GunComponent } from "../components/weapons";
import { gen_gun } from "../procgen/guns"

export const WAVE_DELAY = 3 
export const LEVEL_ADJUSTER = 1/5

export class PickupSystem extends System {
    spawn_pickup(e){
        const pickup = e.getComponent(PickupComponent)

        e.addComponent( LocRotComponent, { location: pickup.spawn_pos } )

        if( pickup.pickup_type == "health" ){
            e.addComponent( ModelComponent, {
                material: "health-pickup",
                geometry: "box",
                scale: new Vector3(0.5,0.5,0.5),
            } )
            e.addComponent( BodyComponent , { 
                bounds_type: BodyComponent.BOX_TYPE, 
                mass: 1 ,
                bounds: new Vector3(0.5,0.5,0.5),
                material: "chaser",
                track_collisions: true,
            } )
            e.addComponent( HealthComponent )
        }else if( pickup.pickup_type == "gun" ){
            const gun = gen_gun(pickup.level * LEVEL_ADJUSTER,false,true,20+(pickup.level*2),true) 
            e.addComponent( ModelComponent, {
                material: gun.bullet_material,
                geometry: "box",
                scale: new Vector3(1.5,0.5,0.5),
            } )
            e.addComponent( BodyComponent , { 
                bounds_type: BodyComponent.BOX_TYPE, 
                mass: 1 ,
                bounds: new Vector3(1.5,0.5,0.5),
                track_collisions: true,
                fixed_rotation: true
            } )
            e.addComponent( GunPickupComponent )
            e.addComponent( GunComponent, gun )
            e.addComponent( RotatorComponent ) // slow spin
        }
    }

    execute(delta,time){
        this.queries.uninitialized.results.forEach( e => {
            this.spawn_pickup(e)
        })

        // TODO remove un-picked-up pickups that expire
        this.queries.active.results.forEach( e => {
            const pickup = e.getComponent(PickupComponent)
            if(pickup.expires != null && pickup.expires < time ){
                e.remove()
            }
        })
    }
}
PickupSystem.queries = {
    uninitialized: {
        components: [ PickupComponent, Not(BodyComponent) ],
    },
    active: {
        components: [ PickupComponent, BodyComponent ],
    }
}