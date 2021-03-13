import { Component, Types } from 'ecsy'

export class AITargetPlayerComponent extends Component {}
AITargetPlayerComponent.schema = {
    max_distance: { type: Types.Number, default: 20 },
    predict: { type: Types.Boolean, default: false },
    aim_jitter: { type: Types.Number, default: 0 }, // angle in radians to be "off" of aim by
}

export class AIChasePlayerComponent extends Component {}
AIChasePlayerComponent.schema = {
    max_distance: { type: Types.Number, default: 40 },
    min_distance: { type: Types.Number, default: 0 },
    speed: { type: Types.Number, default: null },
    force: { type: Types.Number, default: .5 },
}
