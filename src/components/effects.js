import { Component, Types } from "ecsy"
import { Vector3Type } from "../ecs_types";


export class ExplosionComponent extends Component {}
ExplosionComponent.schema = {
    location: { type: Vector3Type },
    size: { type: Types.Number, default: 1.5},
    started: { type: Types.Number },
    duration: { type: Types.Number, default: 0.5 },
    shake: { type: Types.Boolean, default: false },
}

// Todo explosion factory
// Todo explosion shader

export class DamageFlashEffectComponent extends Component {}
DamageFlashEffectComponent.schema = {
    start_time: { type: Types.Number },
    end_time: { type: Types.Number },
    freq: { type: Types.Number, default: 0.5 }
}