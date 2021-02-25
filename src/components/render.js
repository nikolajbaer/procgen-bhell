import { Component, Types } from 'ecsy'

export class MeshComponent extends Component {}
MeshComponent.schema = {
  mesh: { type: Types.Ref }
}

export class ModelComponent extends Component {}
ModelComponent.schema = {
  geometry: { type: Types.String, default: 'box' },
  material: { type: Types.String, default: 'default' },
}
