import { System } from "ecsy"
import * as Tone from 'tone'

export class MusicSystem extends System {
    init (){
        document.querySelector('button')?.addEventListener('click', async () => {
	        await Tone.start()
	        console.log('audio is ready')
            this.create_loop()
        })
        // from https://tonejs.github.io/examples/simpleSynth 
        const synth = new Tone.Synth({
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

    }

    create_loop(){
        const loop = new Tone.Loop( (time,note) => {
            synth.triggerAttackRelease(note, 0.1, time);
        },["C1"]).start(0)
    }

    execute(delta, time){

    }
}