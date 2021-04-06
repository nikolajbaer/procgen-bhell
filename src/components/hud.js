import { Component, Types } from "ecsy"

export class HUDMessageComponent extends Component {}
HUDMessageComponent.schema = {
    message: { type: Types.String },
    duration: { type: Types.Number, default: 3 },
}