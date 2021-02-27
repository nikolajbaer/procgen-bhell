import { System, Not } from "ecsy";
import { DamageableComponent, DamageAppliedComponent } from "../components/damage";

// Todo DamageableComponent , DamageComponent, DamagingComponent

export class DamageSystem extends System {
    execute(delta,time){
        this.queries.damage_taken.results.forEach( e => {
            // apply damage, then remove damageable component
            const damage =  e.getComponent(DamageAppliedComponent)
            const obj = e.getMutableComponent(DamageableComponent)
            obj.health -= damage.amount
            console.log("Applying Damage",damage,obj)
            if( obj.health < 0 ){
                e.remove() // CONSIDER maybe deathcomponent to orchaestrate death anim?
            }
            e.removeComponent(DamageAppliedComponent)
        })
    }
}

DamageSystem.queries = {
    damage_taken: {
        components: [DamageableComponent,DamageAppliedComponent]
    },
}