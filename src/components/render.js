import { Component, TagComponent, Types } from 'ecsy'
import { Vector2Type, Vector3Type, Vector3 } from '../ecs_types'

export class MeshComponent extends Component {}
MeshComponent.schema = {
  mesh: { type: Types.Ref }
}

export class ModelComponent extends Component {}
ModelComponent.schema = {
  geometry: { type: Types.String, default: 'box' },
  material: { type: Types.String, default: 'default' },
  scale: { type: Vector3Type, default: new Vector3(1,1,1) }
}

export class CameraFollowComponent extends Component {}
CameraFollowComponent.schema = {
  offset: { type: Vector3Type },
}

export class RayCastTargetComponent extends Component {}
RayCastTargetComponent.schema = {
  mouse: { type: Vector2Type },
  location: { type: Vector3Type },
}
