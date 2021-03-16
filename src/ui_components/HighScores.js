import React from "react";
import { get_scoreboard } from "../scoreboard/scoreboard";

export class HighScores extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            scores: [],
            your_name: "",
            scoreboard: null,
            submitted: false,
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnSubmit = this.handleOnSubmit.bind(this)
    }

    componentDidMount(){
        const scoreboard = get_scoreboard()
        this.setState({scoreboard:scoreboard})
        // CONSIDER pass through a callback to be attached
        // to on('value') so scoreboard auto-updates in 
        // realtime?
        scoreboard.load_scores().then( (result) => {
            this.updateScores(result)
        })
    }

    updateScores(result){
        const high_scores = []
        result.forEach( (r) => {
            high_scores.push(r)
        })
        this.setState({
            scores: high_scores
        })
    }

    handleOnChange(event){
        this.setState({your_name:event.target.value})
    }

    handleOnSubmit(event){
        this.state.scoreboard.submit(
            this.state.your_name,
            this.props.score.score,
            this.props.score.wave,
        ).then( () => {
            this.setState({submitted: true})
            this.state.scoreboard.load_scores().then( (result) => {
                this.updateScores(result)
            })
        })
    }

    render() {
        let scores = []
        if(this.state.scores.length > 0){
            this.state.scores.forEach( (s) => {
                const w = 40 - (s.name + ' ' + s.score + ' ').length
                let spacer = ''
                for(var i=0;i<w;i++){ spacer += '.' }
                const line = s.name + " " + spacer + " " + s.score
                scores.push(<li key={s.name+"-"+scores.length}>
                    <code>{line}</code>
                </li>)
            })
        }
        while(scores.length < 10){
            const i = "empty-"+scores.length
            scores.push( <li key={i}><code>&nbsp;</code></li> )
        }

        let your_score = ""
        if(this.props.score != null && !this.state.submitted){
            your_score = (
                <div>
                    <div>Your Score: {this.props.score.score}</div>
                    <div>
                        <input type="text" value={this.state.your_name} onChange={this.handleOnChange} /> <button onClick={this.handleOnSubmit}>SUBMIT</button>
                    </div>
                </div>
            ) 
        }else if(this.state.submitted){
            your_score = (
                <div>
                    <div>Your Score: {this.props.score.score}</div>
                    <div>Submitted!</div>
                </div>
            )
        }

        return(
            <div className="menu">
                <h1>High Scores</h1>
                <ul className="highscores">
                    {scores}
                </ul>
                {your_score}
                <p>
                    <button onClick={this.props.closeHandler.bind(this)}>CLOSE</button>
                </p>
            </div>
        )
    }
}
