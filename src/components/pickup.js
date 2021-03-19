import { Component, Types } from "ecsy"
import { Vector3Type } from "../ecs_types"


export class PickupComponent extends Component {}
PickupComponent.schema = {
    spawn_pos: { type: Vector3Type },
    pickup_type: { type: Types.String, default: "health" },
    level: { type: Types.Number, default: 1 },
    expire: { type: Types.Number, default: null },
}