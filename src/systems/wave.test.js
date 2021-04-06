import { HUDMessageComponent } from "../components/hud"
import { PhysicsComponent } from "../components/physics"
import { PlayerComponent } from "../components/player"
import { SoundEffectComponent } from "../components/sound"
import { WaveMemberComponent } from "../components/wave"
import { initialize_test_world, entity_tracker } from "../testing/game_helpers"
import { WaveSystem, WAVE_DELAY } from "./wave"

test('wave creates new wave on delay', () => {
    const world = initialize_test_world(
        [WaveSystem],
        [WaveMemberComponent,PlayerComponent,PhysicsComponent,SoundEffectComponent,HUDMessageComponent]
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

test('wave plays sound on spawn', () => {
    const world = initialize_test_world(
        [WaveSystem],
        [WaveMemberComponent,PlayerComponent,PhysicsComponent,SoundEffectComponent]
    )

    const sounds = entity_tracker(world,{ sounds: { components: [SoundEffectComponent]}})
    const wavesys = world.getSystem(WaveSystem)
    wavesys.spawn_wave()

    // TODO how to check for specific query? without including sound system?
    expect(sounds.queries.sounds.results.length).toBe(1)

})