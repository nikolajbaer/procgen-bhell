import { Component, Types } from 'ecsy'
import { Vector3 } from 'three'
import { Vector3Type } from "../ecs_types"

export class GunComponent extends Component {}
GunComponent.schema = {
    name: { type: Types.String, default: "X-1" },
    barrels: { type: Types.Number, default: 1 },
    barrel_spread: { type: Types.Number, default: 0 },
    barrel_offset: { type: Types.Number, default: 0.25 },
    rate_of_fire: { type: Types.Number, default: 0.1 },
    last_fire: { type: Types.Number, default: -1000 },
    bullet_model: { type: Types.String, default: "sphere" },
    bullet_mass: { type: Types.Number, default: 0.1 },
    bullet_material: { type: Types.String, default: "default_bullet" },
    bullet_speed: { type: Types.Number, default: 3 },
    bullet_damage: { type: Types.Number, default: 2 },
    bullet_life: {  type: Types.Number, default: 3 },
    bullet_scale: { type: Vector3Type, default: null },
    bullet_sound: { type: Types.String, default: "bullet-fire" },
    // Future
    // barrel_mod - maybe alternate how often each barrel fires?
}

export class BulletComponent extends Component {}
BulletComponent.schema = {
    live_to: { type: Types.Number, default: 2 },
    damage: { type: Types.Number, default: 1 },
}

export class FireControlComponent extends Component {}
FireControlComponent.schema = {
    fire1: { type: Types.Boolean, default: false },
    fire2: { type: Types.Boolean, default: false }
}

export class ProxyMineComponent extends Component { }
ProxyMineComponent.schema = {
    trigger_distance: { type: Types.Number, default: 5 },
    delay: { type: Types.Number, default: 0.75 },
    time: { type: Types.Number, default: null },
    damage: { type: Types.Number, default: 5 },
    damage_radius: { type: Types.Number, default: 3 },
}

