import { System } from "ecsy"
import { InventoryComponent } from "../components/inventory"
import { PlayerComponent } from "../components/player"
import { FireControlComponent, GunComponent, OutOfAmmoComponent } from "../components/weapons"
import { gen_gun } from "../procgen/guns"

export class InventorySystem extends System {
    init(){
        this.switching = false
        this.gun_index = 0
    }

    select_next_gun(current_gun){
        this.gun_index = (this.gun_index + 1) % this.queries.guns.results.length
        
        const new_gun = this.queries.guns.results[this.gun_index].getComponent(GunComponent)
        console.log("Switching from",current_gun.name,"to",new_gun.name)
        current_gun.copy(new_gun)
    }

    execute(delta,time){
        if(this.queries.player.results.length == 0){ return }
        const player = this.queries.player.results[0]
        const control = player.getComponent(FireControlComponent)

        if(player.hasComponent(OutOfAmmoComponent)){
            player.removeComponent(GunComponent) 
            player.removeComponent(OutOfAmmoComponent)
            player.addComponent(GunComponent, gen_gun(1)) 
        }
    }
}
InventorySystem.queries = {
    player: {
        components: [PlayerComponent,GunComponent,FireControlComponent]
    },
    guns: { 
        components: [InventoryComponent,GunComponent]
    },
    out_of_ammo: {
        components: [GunComponent,OutOfAmmoComponent]
    }
}