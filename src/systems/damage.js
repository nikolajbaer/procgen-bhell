import { System, Not } from "ecsy";
import { Player } from "tone";
import { DamageableComponent, DamageAppliedComponent, HealableComponent, HealthAppliedComponent } from "../components/damage";
import { ExplosionComponent } from "../components/effects"
import { PhysicsComponent } from "../components/physics";
import { PlayerComponent } from "../components/player";
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

            if( e.hasComponent(PlayerComponent)){
                // Flash material?
            }

            obj.health -= damage.amount
            if( obj.health < 0 ){
                const body = e.getComponent(PhysicsComponent).body
                this.create_explosion(body.position) 
                e.remove() // CONSIDER maybe deathcomponent to orchaestrate death anim?
            }
            e.removeComponent(DamageAppliedComponent)
        })

        this.queries.health_received.results.forEach( e => {
            const healing =  e.getComponent(HealthAppliedComponent)
            const obj = e.getMutableComponent(DamageableComponent)

            if( e.hasComponent(PlayerComponent)){
                // play healing sound
                e.addComponent(SoundEffectComponent, {"sound": "healing"})
            }

            obj.health += healing.amount
            if( obj.health > obj.max_health ){
                obj.health = obj.max_health
            }
            e.removeComponent(HealthAppliedComponent)
        })
    }
}

DamageSystem.queries = {
    damage_taken: {
        components: [DamageableComponent,DamageAppliedComponent,PhysicsComponent]
    },
    health_received: {
        components: [DamageableComponent,HealableComponent,PhysicsComponent,HealthAppliedComponent]
    },
}