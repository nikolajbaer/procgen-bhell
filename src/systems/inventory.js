import { System } from "ecsy"
import { InventoryComponent } from "../components/inventory"
import { PlayerComponent } from "../components/player"
import { FireControlComponent, GunComponent } from "../components/weapons"

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
        // TODO
        if(this.queries.player.results.length == 0){ return }
        const player = this.queries.player.results[0]
        const control = player.getComponent(FireControlComponent)
        const current_gun = player.getMutableComponent(GunComponent)

        // toggle next switch with fire2
        if(control.fire2){
            if(!this.switching){ 
                this.switching = true 
            }
        }else{
            if(this.switching){
                this.switching = false
                this.select_next_gun(current_gun)
            }
        }
    }
}
InventorySystem.queries = {
    player: {
        components: [PlayerComponent,GunComponent,FireControlComponent]
    },
    guns: { 
        components: [InventoryComponent,GunComponent]
    }
}