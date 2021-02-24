import { Component, Types } from 'ecsy'

// Inspired by https://github.com/Lightnet/ecsythreecannonjs

export class PhysicsComponent extends Component {}
PhysicsComponent.schema = {
  body: { type: Types.Ref }
}

export class MeshComponent extends Component {}
MeshComponent.schema = {
  mesh: { type: Types.Ref }
}
