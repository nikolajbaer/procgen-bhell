import { Component, Types } from "ecsy"
import { Vector3Type } from "../ecs_types";


export class ExplosionComponent extends Component {}
ExplosionComponent.schema = {
    location: { type: Vector3Type },
    size: { type: Types.Number, default: 1.5},
    started: { type: Types.Number },
    duration: { type: Types.Number, default: 0.5 },
}

// Todo explosion factory
// Todo explosion shader