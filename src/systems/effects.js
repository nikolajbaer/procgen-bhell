import { System, Not } from "ecsy";
import { ExplosionComponent } from "../components/effects"
import { LocRotComponent } from "../components/physics";
import { MeshComponent, ModelComponent } from "../components/render"
import { Vector3 } from "../ecs_types"

export class EffectsSystem extends System {

    execute(delta,time){
        this.queries.uninitialized_explosions.results.forEach( e => {
            const explosion = e.getMutableComponent(ExplosionComponent)
            // Consider at some point make this a particle system?
            e.addComponent( ModelComponent, { 
                geometry: "sphere", 
                material: "explosion",
                scale: 0.1 ,
                shadow: false
            } )
            e.addComponent( LocRotComponent, {
                location: new Vector3(explosion.location.x,explosion.location.y,explosion.location.z)
            })
            explosion.start = time
        })

        this.queries.active_explosions.results.forEach( e => {
            const explosion = e.getComponent(ExplosionComponent)
            const mesh = e.getComponent(MeshComponent).mesh
            const s = (explosion.start + explosion.duration ) - time 
            if( s <= 0 ){
                e.remove()
            }else{
                // Scale  Factor
                const sv = ( s / explosion.duration ) * explosion.size
                mesh.scale.set(sv,sv,sv)
            }
        })
    }
}

EffectsSystem.queries = {
    uninitialized_explosions: {
        components: [ExplosionComponent,Not(ModelComponent)]
    },
    active_explosions: {
        components: [ExplosionComponent,ModelComponent,MeshComponent]
    },
}