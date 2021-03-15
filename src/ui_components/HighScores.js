import React from "react";
import { get_scoreboard } from "../scoreboard/scoreboard";

export class HighScores extends React.Component {
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
