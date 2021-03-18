import { World } from "ecsy"

export function initialize_test_world(systems,components){
    const world = new World()
    components.forEach( c => {
        world.registerComponent(c)
    })
    systems.forEach( s => {
        world.registerSystem(s)
    })
    return world
}
