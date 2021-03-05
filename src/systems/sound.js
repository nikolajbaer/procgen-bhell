import { System } from "ecsy"
import * as Tone from 'tone'

export class SoundSystem extends System {
    init (){
        let initialized = false
        console.log("Adding listener")
        document.getElementById("render").addEventListener("click", () => {
            if(!initialized){
                console.log("Key Down!")
                Tone.start().then( () => {
                    this.startMusic()
                })
                initialized = true
            }
        })
    }

    startMusic(){
        console.log("starting music")
        // from https://tonejs.github.io/examples/simpleSynth 
        this.synth = new Tone.Synth({
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

        this.create_loop()

        Tone.Transport.toggle()
    }

    create_loop(){
        const loop = new Tone.Sequence( (time,note) => {
            this.synth.triggerAttackRelease(note, 0.1, time);
        },["C2","C3","C2","C3","C2","C3","C2",["C2","C3"]],0.2).start(0)
        console.log("starting loop")
    }

    execute(delta, time){

    }
}