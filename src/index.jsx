import { init_game } from "./game"

// React
import React from "react";
import ReactDOM from "react-dom";
import { HUDSystem } from "./systems/hud";
import { observer } from "mobx-react-lite"

const HUDView = observer( ({ hudState }) => (
    <div className="overlay">
        <div className="hud">
            Score: {hudState.score} |
            Wave: {hudState.wave} |
            Health: {Math.round(hudState.health)} / {hudState.max_health}
        </div>
        <div className="hud">
            WASD to move, LMB/RMB to fire <br/>
            <a href="https://github.com/nikolajbaer/procgen-bhell" target="_blank" title="source code on github">&lt;src&gt;</a>
        </div>
    </div>    
))

class GameUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hudState: null, playSound: true }
        this.handleSoundChange = this.handleSoundChange.bind(this)
    }

    componentDidMount(){
    }

    start_game(){
        const world = init_game(this.state.playSound)
        this.setState({hudState:world.getSystem(HUDSystem).state})
    }

    handleSoundChange(event){
        this.setState({playSound: event.target.checked})
    }

    render() {

        let view;
        if( this.state.hudState != null) {
            view = <HUDView hudState={this.state.hudState} />
        }else{
            view = <div className="menu">
                <p>a procedurally generated</p>
                <h1>BULLET HELL</h1>
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

ReactDOM.render( <GameUI />, document.getElementById("app"))

