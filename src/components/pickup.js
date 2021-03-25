import { TagComponent, Component, Types } from "ecsy"
import { Vector3Type } from "../ecs_types"


export class PickupComponent extends Component {}
PickupComponent.schema = {
    spawn_pos: { type: Vector3Type },
    pickup_type: { type: Types.String, default: "health" },
    level: { type: Types.Number, default: 1 },
    expires: { type: Types.Number, default: null },
}

export class HealthComponent extends Component {}
HealthComponent.schema = {
    amount: { type: Types.Number, default: 10 }
}

export class GunPickupComponent extends TagComponent {}
