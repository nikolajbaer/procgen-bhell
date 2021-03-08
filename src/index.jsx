import { init_game } from "./game"

// React
import React from "react";
import ReactDOM, { render } from "react-dom";
import { HUDSystem } from "./systems/hud";
import { observer } from "mobx-react-lite"

class HealthBar extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="healthbar">
                <div style={{width:((this.props.health/this.props.max_health)*100) + "%"}}>
                    <span>{Math.round(this.props.health)}/{this.props.max_health}</span>
                </div>
            </div>
        )
    }
}


const HUDView = observer( ({ hudState }) => (
    <div className="overlay">
        <div className="gun_stats">
            <h3>gun stats</h3>
            <dl>
                <dd>Barrels: </dd>
                    <dt>{hudState.gun.barrels}</dt>
                <dd>Bullet Damage:</dd>
                    <dt>{hudState.gun.bullet_damage}</dt>
                <dd>Bullet Speed:</dd>
                    <dt>{hudState.gun.bullet_speed}</dt>
                <dd>Bullet Distance</dd>
                    <dt>{hudState.gun.bullet_life}</dt>
            </dl>
        </div>
        <div className="bottom">
            <div className="hud">
                Score: {hudState.score} |
                Wave: {hudState.wave} |
                Enemies: {hudState.enemies_left}/{hudState.total_enemies}
            </div>
            <HealthBar health={hudState.health} max_health={hudState.max_health} />
            <div className="hud">
                WASD to move, LMB/RMB to fire <br/>
            </div>
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
                <p>
                    By <a title="nikolajbaer.us" target="_blank" href="https://www.nikolajbaer.us/">Nikolaj Baer</a>
                    <a href="https://github.com/nikolajbaer/procgen-bhell" target="_blank" title="source code on github">(src)</a>
                </p>
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

