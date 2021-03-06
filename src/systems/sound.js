import { System } from "ecsy"
import * as Tone from 'tone'
import { SoundEffectComponent } from "../components/sound"

export class SoundSystem extends System {
    init (){
        this.initialized = false
    }

    activate() {
        // activating
        Tone.start().then( () => {
            this.startMusic()
        })
    }

    set_volume(v){
        Tone.Transport.set_volume(v)
    }

    startMusic(){
        console.log("starting music")
        // from https://tonejs.github.io/examples/simpleSynth 
        this.bass_synth = new Tone.Synth({
			oscillator: {
				type: "amtriangle",
				harmonicity: 0.5,
				modulationType: "sine"
			},
			envelope: {
				attackCurve: "exponential",
				attack: 0.05,
				decay: 0.2,
				sustain: 0.2,
				release: 1.5,
			},
			portamento: 0.05
		}).toDestination();

        this.lead_synth = new Tone.PolySynth(Tone.Synth, {
			oscillator: {
				type: "fatsawtooth",
				count: 3,
				spread: 30
			},
			envelope: {
				attack: 0.01,
				decay: 0.1,
				sustain: 0.5,
				release: 0.4,
				attackCurve: "exponential"
			},
		}).toDestination();

        this.bullet_synth = new Tone.PolySynth(Tone.Synth).toDestination()
        this.bullet_synth.volume.value = -15;

        const explode_dist = new Tone.Distortion(0.8).toDestination()
        this.explode_synth = new Tone.PolySynth(Tone.FMSynth)
        this.explode_synth.connect(explode_dist)

        this.create_bass_loop()

        Tone.Transport.toggle()
        this.initialized= true
    }

    create_bass_loop(){
        const beat = 0.2
        const bass_loop = new Tone.Sequence( (time,note) => {
            this.bass_synth.triggerAttackRelease(note, beat/2, time);
        },["C2","C3","C2","C3","C2","C3","C2",["C2","C3"]],beat).start(0)
    }

    create_wave_loop(wave){
        const lead_note = "C5"
        const sequence =[
            [lead_note,null],
            [lead_note,lead_note],
            [lead_note,null],
            [lead_note,lead_note],
            [lead_note,null],
            null,
            null,
            null
        ]
        const lead_loop = new Tone.Sequence( (time,note) => {
            this.lead_synth.triggerAttackRelease(note, beat/3, time);
        },sequence,beat).start( beat * 4 * 3 )

     }

    execute(delta, time){
        if(!this.initialized){ return }

        this.queries.effects.results.forEach( e => {
            const effect = e.getComponent(SoundEffectComponent)  
            switch (effect.sound) {
                case "explode":
                    this.explode_synth.triggerAttackRelease("C2",.1)
                    break
                case "self-destruct":
                    this.explode_synth.triggerAttackRelease("G2",.2)
                    break
                case "bullet-fire":
                    this.bullet_synth.triggerAttackRelease("A4",.1)
                    break
            }
            e.removeComponent(SoundEffectComponent)
        })
    }
}

SoundSystem.queries = {
    effects: {
        components: [ SoundEffectComponent ]
    }
}