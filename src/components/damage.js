import { Component, TagComponent, Types } from 'ecsy'
import { Vector2Type, Vector3Type, Vector3 } from '../ecs_types'

export class DamageableComponent extends Component {}
DamageableComponent.schema = {
    max_health: { type: Types.Number, default: 100 },
    health: { type: Types.Number, default: 100 },
}

export class DamageAppliedComponent extends Component {}
DamageAppliedComponent.schema = {
    amount: { type: Types.Number, default: 1 },
}

export class DamageComponent extends Component {}
DamageComponent.schema = {
    damage: { type: Types.Number, default: 1 },
    destroy: { type: Types.Boolean, default: true },
}

export class HealableComponent extends TagComponent {}

export class HealthAppliedComponent extends Component {}
HealthAppliedComponent.schema = {
    amount: { type: Types.Number, default: 10 },
}
