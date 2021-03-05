import { System, Not } from "ecsy";
import { DamageableComponent, DamageAppliedComponent } from "../components/damage";
import { ExplosionComponent } from "../components/effects"
import { PhysicsComponent } from "../components/physics";
import { SoundEffectComponent } from "../components/sound";
import { Vector3 } from "../ecs_types";

// Todo DamageableComponent , DamageComponent, DamagingComponent

export class DamageSystem extends System {

    create_explosion(position){
        const e = this.world.createEntity()
        e.addComponent( ExplosionComponent, { 
            location: new Vector3(position.x,position.y,position.z)
       })
       e.addComponent(SoundEffectComponent, { sound: "explode" } )
    }

    execute(delta,time){
        this.queries.damage_taken.results.forEach( e => {
            // apply damage, then remove damageable component
            const damage =  e.getComponent(DamageAppliedComponent)
            const obj = e.getMutableComponent(DamageableComponent)

            obj.health -= damage.amount
            if( obj.health < 0 ){
                const body = e.getComponent(PhysicsComponent).body
                this.create_explosion(body.position) 
                e.remove() // CONSIDER maybe deathcomponent to orchaestrate death anim?
            }
            e.removeComponent(DamageAppliedComponent)
        })
    }
}

DamageSystem.queries = {
    damage_taken: {
        components: [DamageableComponent,DamageAppliedComponent,PhysicsComponent]
    },
}