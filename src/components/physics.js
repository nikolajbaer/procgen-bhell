import { Component, Types } from 'ecsy'
import * as CANNON from "cannon-es"
import { Vector3Type } from '../ecs_types'
import { Vector3 } from 'three'

// inpsired by https://github.com/macaco-maluco/thermal-runway/blob/master/src/components/

export class LocRotComponent extends Component {}
LocRotComponent.schema = {
  location: { type: Vector3Type },
  rotation: { type: Vector3Type },
}

export class BodyComponent extends Component {}
BodyComponent.schema = {
  mass: { type: Types.Number, default: 1  },
  bounds_type: { type: Types.Number, default: 0  },
  bounds: { type: Vector3Type, default: new Vector3(1,1,1) },
  body_type: { type: Types.Number, default: CANNON.Body.DYNAMIC }, 
  material: { type: Types.String, default: 'default' },
  velocity: { type: Vector3Type },
}
// Bounds Types
BodyComponent.SPHERE_TYPE = 0
BodyComponent.BOX_TYPE = 1
BodyComponent.PLANE_TYPE = 2
// Body Types
BodyComponent.KINEMATIC = CANNON.Body.KINEMATIC
BodyComponent.DYNAMIC = CANNON.Body.DYNAMIC
BodyComponent.STATIC = CANNON.Body.STATIC

export class PhysicsComponent extends Component {}
PhysicsComponent.schema = {
  body: { type: Types.Ref }
}
