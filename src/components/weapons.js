import { Component, Types } from 'ecsy'
import { Vector3 } from 'three'
import { Vector3Type } from "../ecs_types"

export class GunComponent extends Component {}
GunComponent.schema = {
    barrels: { type: Types.Number, default: 1 },
    rate_of_fire: { type: Types.Number, default: 0.1 },
    last_fire: { type: Types.Number, default: -1000 },
    bullet_model: { type: Types.String, default: "sphere" },
    bullet_material: { type: Types.String, default: "default_bullet" },
    bullet_damage: { type: Types.Number, default: 1 },
    bullet_speed: { type: Types.Number, default: 3 },
    bullet_damage: { type: Types.Number, default: 2 },
    bullet_life: {  type: Types.Number, default: 3 },
}

export class BulletComponent extends Component {}
BulletComponent.schema = {
    live_to: { type: Types.Number, default: 2 },
    damage: { type: Types.Number, default: 1 },
}

export class FireControlComponent extends Component {}
FireControlComponent.schema = {
    at: { type: Vector3Type },
    from: { type: Vector3Type },
    fire1: { type: Types.Boolean, default: false },
    fire2: { type: Types.Boolean, default: false }
}
