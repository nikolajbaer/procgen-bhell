import { Component, Types } from 'ecsy'

export class SoundEffectComponent extends Component {}
SoundEffectComponent.schema = {
    sound: { type: Types.String }
}