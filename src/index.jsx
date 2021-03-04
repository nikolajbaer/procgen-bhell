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
            Health: {hudState.health} / {hudState.max_health}
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
        this.state = { hudState: null }
    }

    componentDidMount(){
        const world = init_game()
        this.setState({hudState:world.getSystem(HUDSystem).state})
    }

    render() {

        let hud;
        if( this.state.hudState != null) {
            hud = <HUDView hudState={this.state.hudState} />
        }else{
            hud = <div></div>
        }

        return (
        <div id="game">
            <canvas id="render"></canvas>
            {hud}
        </div>
        )
    }
}

ReactDOM.render( <GameUI />, document.getElementById("app"))

