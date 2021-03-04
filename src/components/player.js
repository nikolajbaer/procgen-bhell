import { Component, Types } from 'ecsy'

export class PlayerComponent extends Component {}
PlayerComponent.schema = {
    score: { type: Types.Number, default: 0 },
    waves: { type: Types.Number, default: 0 },
    current_wave_enemies: { type: Types.Number, default: 0 },
}