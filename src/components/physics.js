import { Component, Types } from 'ecsy'
import * as CANNON from "cannon-es"

// inpsired by https://github.com/macaco-maluco/thermal-runway/blob/master/src/components/

export class LocRotComponent extends Component {}
LocRotComponent.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0  },
  z: { type: Types.Number, default: 0  },
  rotx: { type: Types.Number, default: 0  },
  roty: { type: Types.Number, default: 0  },
  rotz: { type: Types.Number, default: 0  },
}

export class BodyComponent extends Component {}
BodyComponent.schema = {
  mass: { type: Types.Number, default: 1  },
  bounds_type: { type: Types.Number, default: 0  },
  x: { type: Types.Number, default: 1 },
  y: { type: Types.Number, default: 1  },
  z: { type: Types.Number, default: 1  },
  body_type: { type: Types.Number, default: CANNON.Body.DYNAMIC }, 
  material: { type: Types.String, default: 'default' },
  // starting velocity
  vx: { type: Types.Number, default: 0 },
  vy: { type: Types.Number, default: 0 },
  vz: { type: Types.Number, default: 0 },
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
