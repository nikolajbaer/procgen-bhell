import { TagComponent,Component, Types } from 'ecsy'

export class EnemyComponent extends Component {}
EnemyComponent.schema = {
    score: { type: Types.Number, default: 1 }
}

export class ShakeGroundComponent extends TagComponent {}
