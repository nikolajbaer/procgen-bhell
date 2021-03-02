import { Component, Types } from 'ecsy'

export class AITargetPlayer extends Component {}
AITargetPlayer.schema = {
    max_distance: { type: Types.Number, default: 20 }
}
