import { init_game } from "./game"

// React
import React from "react";
import ReactDOM, { render } from "react-dom";
import { HUDSystem } from "./systems/hud";
import { observer } from "mobx-react-lite"
import { gun_output_score } from "./procgen/guns"
import { get_scoreboard } from "./scoreboard/scoreboard";

class HealthBar extends React.Component {
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
class GunStat extends React.Component {
    render(){
        return(
            <div className="gunStat">
                <div>{this.props.name}</div>
                <div className="bar" style={{width:((this.props.value/this.props.max_value)*100) + "%",backgroundColor:this.props.color}}>
                </div>
            </div>
        )
    }
}

class HighScores extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            scores: []
        }
    }
    componentDidMount(){
        const score = get_scoreboard()
        score.load_scores().then( (result) => {
            const high_scores = []
            result.forEach( (r) => {
                console.log(r)
                high_scores.push(r)
            })
            console.log(high_scores)
            this.setState({
                scores: high_scores
            })
        })
    }

    render() {
        const scores = this.state.scores.map( (s) => {
            return (<div key={s.name}>
                <strong>{s.name}</strong> <strong>{s.score}</strong>
            </div>)
        })
        return(
            <div className="menu">
                <h1>High Scores</h1>
                {scores}
                <button onClick={this.props.closeHandler.bind(this)}>CLOSE</button>
            </div>
        )
    }
}

const HUDView = observer( ({ hudState,newGameHandler,highScoreHandler }) => {
    if(hudState.gameover){
        return (<div className="menu">
                    <h1>GAME OVER</h1>
                    <h3>Score: {hudState.score}</h3>
                    <p>You were eliminated during Wave {hudState.wave}</p>

                    <p>Save your score: <input type="text" /> </p>

                    <button onClick={highScoreHandler.bind(this)}>HIGH SCORES</button>
                    <button onClick={newGameHandler.bind(this)}>PLAY AGAIN</button>
                </div>)
    }

    return (<div className="overlay">
        <div className="gun_stats">
            <h2 style={{color:hudState.gun.bullet_color}}>Gun: {hudState.gun.name}</h2>
            <div>Score {gun_output_score(hudState.gun)}</div>
            <GunStat name="Barrels" value={hudState.gun.barrels} max_value={5} color={hudState.gun.bullet_color}></GunStat>
            <GunStat name="Bullet Damage" value={hudState.gun.bullet_damage} max_value={5} color={hudState.gun.bullet_color}></GunStat>
            <GunStat name="Bullet Speed" value={hudState.gun.bullet_speed} max_value={5} color={hudState.gun.bullet_color}></GunStat>
            <GunStat name="Bullet Distance" value={hudState.gun.bullet_life} max_value={3} color={hudState.gun.bullet_color}></GunStat>
            <h4>Gun Inventory</h4>
            <ul>
                {hudState.inventory.map((gun) => <li key={gun.name}>{gun.name}</li>)} 
            </ul>
        </div>
        <div className="flash">
            <h2 style={{color:hudState.gun.bullet_color}}>{hudState.gun.name}</h2>
            <p>[gun level: {gun_output_score(hudState.gun).toFixed(2)}]</p>
        </div>
        <div className="bottom">
            <div className="hud">
                Score: {hudState.score} |
                Wave: {hudState.wave} |
                Enemies: {hudState.enemies_left}/{hudState.total_enemies}
            </div>
            <HealthBar health={hudState.health} max_health={hudState.max_health} />
            <div className="hud">
                WASD to move, LMB to fire <br/>
            </div>
        </div>
    </div>)
})


class GameUI extends React.Component {
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

ReactDOM.render( <GameUI />, document.getElementById("app"))

