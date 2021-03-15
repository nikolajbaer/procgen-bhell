import React from "react";
import { HUDView } from "./HUDView"
import { HUDSystem } from "../systems/hud";
import { HighScores } from "./HighScores"
import { init_game } from "../game"

export class GameUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hudState: null, 
            playSound: true, 
            showHighScores: false,
        }
        this.handleSoundChange = this.handleSoundChange.bind(this)
    }

    componentDidMount(){
    }

    start_game(){
        const world = init_game(this.state.playSound)
        this.setState({hudState:world.getSystem(HUDSystem).state})
    }

    show_high_scores(show){
        this.setState({showHighScores:show})
    }

    handleSoundChange(event){
        this.setState({playSound: event.target.checked})
    }

    render() {

        let view;
        if( this.state.hudState != null) {
            view = <HUDView hudState={this.state.hudState} newGameHandler={() => this.start_game()} highScoreHandler={() => this.show_high_scores(true)} />
        }else if(this.state.showHighScores){
            view = <HighScores closeHandler={() => this.show_high_scores(false)} />
        }else{
            view = <div className="menu">
                <p>a procedurally generated</p>
                <h1>BULLET HELL</h1>
                <p>
                    By <a title="nikolajbaer.us" target="_blank" href="https://www.nikolajbaer.us/">Nikolaj Baer</a>
                    <a href="https://github.com/nikolajbaer/procgen-bhell" target="_blank" title="source code on github">(src)</a>
                </p>
                <button onClick={() => this.show_high_scores(true)}>HIGH SCORES</button>
                <button onClick={() => this.start_game()}>START</button>
                <p>
                    <input type="checkbox" checked={this.state.playSound} onChange={this.handleSoundChange} /> Sound
                </p>
            </div>
        }

        return (
        <div id="game">
            <canvas id="render"></canvas>
            {view}
        </div>
        )
    }
}