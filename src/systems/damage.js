import { System, Not } from "ecsy";
import { ShooterComponent, GunComponent, BulletComponent, AimComponent } from "../components/weapons"

export class DamageSystem extends System {
    execute(delta,time){
    }
}

DamageSystem.queries = {
    damageable: {
        components: [DamageComponent]
    },
    damaging: {
        components: [BulletComponent]
    },
}