import { Component, Types } from "ecsy";


export class WaveMemberComponent extends Component {}
WaveMemberComponent.schema = {
    wave: { type: Types.Number },
    boss: { type: Types.Boolean, default: false },
}