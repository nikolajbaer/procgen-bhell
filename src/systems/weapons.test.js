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
    e.addComponent(PhysicsComponent)
    e.addComponent(GunComponent, { ammo: 5 })

    weaponsys.spawn_bullet(
        e.getMutableComponent(GunComponent),
        new CANNON.Vec3(1,0,0),
        new CANNON.Vec3(0,0,0),
        5
    )
   
    world.execute(1,1)

    expect(e.getComponent(GunComponent).ammo).toBe(4)
    
})