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

    const wavesys = world.getSystem(WaveSystem)
    const p = world.createEntity()
    p.addComponent(PlayerComponent)
    p.addComponent(PhysicsComponent) // argh

    expect(wavesys.wave_delay).toBe(null)
    world.execute(1,0)
    
    expect(wavesys.queries.player.results.length).toBe(1)
    expect(wavesys.queries.active.results.length).toBe(0)
    expect(wavesys.wave_delay).toBe(WAVE_DELAY)

    world.execute(WAVE_DELAY-1,WAVE_DELAY)
    expect(wavesys.queries.active.results.length).toBe(3)

})