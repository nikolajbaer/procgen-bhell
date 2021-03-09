import { TagComponent, Component,Types } from "ecsy"

export class HealthComponent extends Component {}
HealthComponent.schema = {
    amount: { type: Types.Number, default: 10 }
}

export class GunPickupComponent extends TagComponent {}
