import { PhysicsComponent } from "../components/physics"
import { PlayerComponent } from "../components/player"
import { WaveMemberComponent } from "../components/wave"
import { initialize_test_world } from "../testing/game_helpers"
import { WaveSystem, WAVE_DELAY } from "./wave"

test('wave creates new wave on delay', () => {
    const world = initialize_test_world(
        [WaveSystem],
        [WaveMemberComponent,PlayerComponent,PhysicsComponent]
    )

    world.execute(1,0)
    expect(world.getSystem(WaveSystem).wave_delay).toBe(WAVE_DELAY)
    world.execute(WAVE_DELAY,1)
    expect(world.getSystem(WaveSystem).wave_delay).toBe(WAVE_DELAY - 1)
})