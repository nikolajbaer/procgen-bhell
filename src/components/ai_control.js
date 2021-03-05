import { Component, Types } from 'ecsy'

export class AITargetPlayerComponent extends Component {}
AITargetPlayerComponent.schema = {
    max_distance: { type: Types.Number, default: 20 }
}

export class AIChasePlayerComponent extends Component {}
AIChasePlayerComponent.schema = {
    max_distance: { type: Types.Number, default: 40 },
    min_distance: { type: Types.Number, default: 0 },
    speed: { type: Types.Number, default: .1 },
}
