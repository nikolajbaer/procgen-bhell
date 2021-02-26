import { Component, Types } from 'ecsy'

export class ShooterComponent extends Component {}
ShooterComponent.schema = {
    weapon: { type: Types.Ref } // ref to gun model?
}

export class GunComponent extends Component {}
GunComponent.schema = {
    barrels: { type: Types.Number, default: 1 },
    rate_of_fire: { type: Types.Number, default: 0.1 },
    last_fire: { type: Types.Number, default: -1000 },
    bullet_model: { type: Types.String, default: "sphere" },
    bullet_material: { type: Types.String, default: "default_bullet" },
    bullet_damage: { type: Types.Number, default: 1 },
    bullet_speed: { type: Types.Number, default: 10 },
}

export class BulletComponent extends Component {}
BulletComponent.schema = {
    life: { type: Types.Number, default: 2 },
    damage: { type: Types.Number, default: 1 },
}