import { System } from "ecsy"
import * as Tone from 'tone'
import { MusicLoopComponent, SoundEffectComponent } from "../components/sound"

export class SoundSystem extends System {
    init (){
        this.initialized = false
    }

    activate() {
        Tone.start().then( () => {
            this.initSynths()
        })
    }

    set_volume(v){
        Tone.Transport.set_volume(v)
    }

    initSynths(){

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

        const chorus = new Tone.Chorus(5, .1, 3.5).toDestination().start();
        this.good_synth = new Tone.PolySynth(Tone.AMSynth).connect(chorus)

        this.hat_synth = new Tone.PluckSynth().toDestination();
        this.hat_synth.volume.value = -4

        this.synths = [
            this.bass_synth,
            this.lead_synth,
            this.bullet_synth,
            this.explode_synth,
            this.good_synth,
            this.hat_synth,
        ]

        Tone.Transport.bpm.value = 150 
        Tone.Transport.start()
        this.initialized= true
    }

    create_loops(){
        this.bass_loop = new Tone.Sequence( (time,note) => {
            this.bass_synth.triggerAttackRelease(note, .1, time);
        },["C2","C3","C2","C3","C2","C3","C2",["C2","C3"]],"8n").start(0)

        this.hat_loop = new Tone.Sequence( (time,note) => {
            this.hat_synth.triggerAttackRelease(note, .1, time);
        },["C5","C5","C5",null,"C5",null,"C5",null],"16n")

        this.loops = [
            this.bass_loop,
            this.hat_loop,
        ]
    }

    stop(){
        if( this.initialized ){
            console.log("Stopping music and loops")
            Tone.Transport.stop()
            this.synths.forEach( s => {
                s.disconnect()
            })
            this.loops.forEach( l => {
                l.stop()
            })
        }
    }

    execute(delta, time){
        if(!this.initialized){ return }

        if(this.queries.music.results.length == 0){
            const e = this.world.createEntity()
            e.addComponent(MusicLoopComponent)
            this.create_loops()
        }

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
                case "big-bullet-fire":
                    this.bullet_synth.triggerAttackRelease("F3",.4)
                    break
                case "healing":
                    this.good_synth.triggerAttackRelease(["G4","C5","E5"],.3)
                    break
            }
            e.removeComponent(SoundEffectComponent)
        })
    }
}

SoundSystem.queries = {
    effects: {
        components: [ SoundEffectComponent ]
    },
    music: { 
        components: [MusicLoopComponent]
    }
}