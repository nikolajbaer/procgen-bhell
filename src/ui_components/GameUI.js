import React from "react";
import { HUDView } from "./HUDView"
import { HUDSystem } from "../systems/hud";
import { HighScores } from "./HighScores"
import { init_game } from "../game"
import { MobileStick } from "./MobileStick"

export class GameUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hudState: null, 
            playSound: !('ontouchstart' in window),  // mobile devices don't like tone.js
            fullscreen: false,
            showHighScores: false,
            score: null,
            world: null,
        }
        this.handleSoundChange = this.handleSoundChange.bind(this)
        this.handleFullscreen = this.handleFullscreen.bind(this)
    }

    componentDidMount(){
    }

    start_game(){
        if(this.state.world != null){
            this.state.world.stop()
        }
        const world = init_game(this.state.playSound)
        this.setState({hudState:world.getSystem(HUDSystem).state,world:world})
    }

    show_high_scores(show,score=null,wave=null){
        console.log("Showing high scores",show,score)
        let score_data = null
        if(score){
            score_data = {
                score: score,
                wave: wave,
            }
        }
        this.setState({showHighScores:show, score:score_data})
    }

    handleSoundChange(event){
        this.setState({playSound: event.target.checked})
    }

    handleFullscreen(event){
        const showFullscreen = event.target.checked
        if (!document.fullscreenElement && showFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen && !showFullscreen) {
                document.exitFullscreen();
            }
        }
        this.setState({fullscreen:showFullscreen})
    }

    render() {

        const playing = this.state.hudState != null && !this.state.showHighScores
        let view;
        if( playing ) {
            view = <HUDView 
                        hudState={this.state.hudState} 
                        newGameHandler={() => this.start_game()} 
                        highScoreHandler={(score,wave) => this.show_high_scores(true,score,wave)} 
                        score={null}
                    />
        }else if(this.state.showHighScores){
            view = <HighScores closeHandler={() => this.show_high_scores(false)} score={this.state.score} />
        }else{
            view = <div className="menu">
                <p>a procedurally generated</p>
                <h1>BULLET HELL</h1>
                <p>
                    By <a title="nikolajbaer.us" target="_blank" href="https://www.nikolajbaer.us/">Nikolaj Baer</a>
                    <a href="https://github.com/nikolajbaer/procgen-bhell" target="_blank" title="source code on github">(src)</a>
                </p>
                <p>
                    <button onClick={() => this.start_game()}>START</button>
                </p>
                <p>
                    <button onClick={() => this.show_high_scores(true)}>HIGH SCORES</button>
                </p>
                <p>
                    <input type="checkbox" checked={this.state.fullscreen} onChange={this.handleFullscreen} /> Fullscreen
                    <input type="checkbox" checked={this.state.playSound} onChange={this.handleSoundChange} /> Sound
                </p>
            </div>
        }

        let touch_controls = ""
        if('ontouchstart' in window && playing){
            touch_controls = (
                <React.Fragment>
                    <MobileStick className="dpad" joystickId="dpad" pad_radius={20} width={150} height={150} />
                    <MobileStick activeColor="rgba(255,0,0,0.3)" clasSName="aim" joystickId="aim" pad_radius={20} width={150} height={150} />
                </React.Fragment>
            )
        }

        return (
        <div id="game">
            <canvas id="render"></canvas>
            {view}
            {touch_controls}
        </div>
        )
    }
}