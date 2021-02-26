import { System, Not } from "ecsy";
import { ShooterComponent, GunComponent, BulletComponent } from "../components/weapons"
import { BodyComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { ControlsComponent } from "../components/controls"

export class WeaponsSystem extends System {
    execute(delta,time){
        this.queries.shooters.results.forEach( e => {
            const controls = e.getComponent(ControlsComponent)
            const gun = e.getMutableComponent(GunComponent)  

            if( gun.last_fire + gun.rate_of_fire < time && controls.fire1 ){
                // fire
                // TODO implement multiple barrels
                // spawn bullet
                /*
                const bulletEntity = this.world.createEntity() 
                bulletEntity.addComponent(BodyComponent, {
                })
                bulletEntity.addComponent( ModelComponent, {

                })
                */
                console.log("Bang!")
                gun.last_fire = time
            }
        })
    }
}

WeaponsSystem.queries = {
    shooters: {
        components: [ GunComponent, ShooterComponent, ControlsComponent ]
    }
}