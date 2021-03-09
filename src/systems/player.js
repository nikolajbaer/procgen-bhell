import { System, Not } from "ecsy";
import { PlayerComponent } from "../components/player";
import { BodyComponent, LocRotComponent } from "../components/physics"
import { GunComponent, FireControlComponent } from "../components/weapons"
import { ModelComponent, CameraFollowComponent } from "../components/render"
import { DamageableComponent, HealableComponent } from "../components/damage"
import { Vector3 } from "../ecs_types"
import { gen_gun } from "../procgen/guns"

const RESPAWN_DELAY = 3

export class PlayerSystem extends System {
    init(){
        this.respawn_delay = 1  // non null for immediate start
        this.lives = 1
    }

    spawn_player(){
        const playerEntity = this.world.createEntity()
        playerEntity.addComponent( BodyComponent, { 
            mass: 1, 
            bounds_type: BodyComponent.BOX_TYPE, 
            body_type: BodyComponent.DYNAMIC,
            material: "player" 
        })
        playerEntity.addComponent( LocRotComponent, { location: new Vector3(0,.5,0) } )
        playerEntity.addComponent( ModelComponent, { geometry: "box", material: "player" } )
        playerEntity.addComponent( GunComponent, gen_gun() )
        playerEntity.addComponent( FireControlComponent )
        playerEntity.addComponent( PlayerComponent )
        playerEntity.addComponent( HealableComponent )
        playerEntity.addComponent( DamageableComponent, { health: 25, max_health: 25 } )
        playerEntity.addComponent( CameraFollowComponent, { offset: new Vector3(0,40,-10) })
    }

    execute(delta,time){
        if(this.queries.active.results.length == 0){
            if(this.respawn_delay == null && this.lives > 0){
                this.respawn_delay = time + RESPAWN_DELAY
            }else if(this.respawn_delay <= time && this.lives > 0){
                this.spawn_player()
                this.respawn_delay = null
                this.lives -= 1
            }
        }
    }
}

PlayerSystem.queries = {
    active: {
        components: [PlayerComponent]
    }
}