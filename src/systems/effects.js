import { System, Not } from "ecsy";
import { DamageFlashEffectComponent, ExplosionComponent } from "../components/effects"
import { LocRotComponent } from "../components/physics";
import { CameraShakeComponent, MeshComponent, ModelComponent } from "../components/render"
import { Vector3 } from "../ecs_types"
import * as THREE from "three"

const FLASH_COLOR = new THREE.Color("#ff0000")

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
            if(explosion.shake){
                e.addComponent(CameraShakeComponent)
            }
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

        this.queries.damage_flashing.results.forEach( e => {
            const mesh = e.getComponent(MeshComponent).mesh
            const flash = e.getMutableComponent(DamageFlashEffectComponent)
            const material = mesh.material

            // preserve the base color if we haven't already
            if(material._base_color == undefined){
                material._base_color = material.color
            }

            const v = ((time - flash.start_time)/(flash.end_time - flash.start_time))
            if(v < 1.0){
                material.color = material._base_color.clone().lerp(FLASH_COLOR,Math.sin(v*flash.freq))
            }else{
                material.color = material._base_color
                e.removeComponent(DamageFlashEffectComponent)
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
    damage_flashing: {
        components: [DamageFlashEffectComponent,MeshComponent]
    }
}