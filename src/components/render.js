import { Component, Types } from 'ecsy'
import { Camera } from 'three'

export class MeshComponent extends Component {}
MeshComponent.schema = {
  mesh: { type: Types.Ref }
}

export class ModelComponent extends Component {}
ModelComponent.schema = {
  geometry: { type: Types.String, default: 'box' },
  material: { type: Types.String, default: 'default' },
}

export class CameraFollowComponent extends Component {}
CameraFollowComponent.schema = {
  offset_x: { type: Types.Number, default: 0 },
  offset_y: { type: Types.Number, default: 40 },
  offset_z: { type: Types.Number, default: -5 },
}