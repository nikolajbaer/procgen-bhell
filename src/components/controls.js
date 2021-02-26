import { Component, Types } from 'ecsy'

export class ControlsComponent extends Component {}
ControlsComponent.schema = {
    fire1: { type: Types.Boolean, default: false },
    fire2: { type: Types.Boolean, default: false }
}
