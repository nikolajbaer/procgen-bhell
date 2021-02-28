import { Component, Types } from 'ecsy'

export class PlayerComponent extends Component {}
PlayerComponent.schema = {
    score: { type: Types.Number, default: 0 }
}