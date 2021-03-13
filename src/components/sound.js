import { Component, Types } from 'ecsy'

export class SoundEffectComponent extends Component {}
SoundEffectComponent.schema = {
    sound: { type: Types.String }
}

export class MusicLoopComponent extends Component {}
MusicLoopComponent.schema = {
    playing: { type: Types.Boolean, default: false }
}