import { BodyComponent, LocRotComponent, PhysicsComponent } from "../components/physics"
import { ModelComponent } from "../components/render"
import { SoundEffectComponent } from "../components/sound"
import { BulletComponent, FireControlComponent, GunComponent } from "../components/weapons"
import { initialize_test_world, create_physics_body } from "../testing/game_helpers"
import { WeaponsSystem } from "./weapons"
import * as CANNON from "cannon-es"

test('gun runs out of ammo', () => {
    const world = initialize_test_world(
        [WeaponsSystem],
        [   FireControlComponent,PhysicsComponent,SoundEffectComponent,
            GunComponent,BodyComponent,LocRotComponent,ModelComponent,BulletComponent ]
    )

    const weaponsys = world.getSystem(WeaponsSystem)
    const e = world.createEntity()
    e.addComponent(FireControlComponent)
    e.addComponent(PhysicsComponent, {body: create_physics_body()})
    e.addComponent(GunComponent, { ammo: 5 })

    const player_body = create_physics_body()

    weaponsys.fire(e,e.getMutableComponent(GunComponent),player_body,0)
    expect(e.getComponent(GunComponent).ammo).toBe(4)
    weaponsys.fire(e,e.getMutableComponent(GunComponent),player_body,0)
    weaponsys.fire(e,e.getMutableComponent(GunComponent),player_body,0)
    expect(e.getComponent(GunComponent).ammo).toBe(2)
    
})