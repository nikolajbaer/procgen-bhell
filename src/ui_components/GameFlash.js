import React from "react";

export class GameFlash extends React.Component {

    render(){
        let title = (this.props.title != null)?(<div className="show">{this.props.title}</div>):""
        if(title){ console.log("showing game flash") }else{
            console.log("hiding game flash")
        }
        return(
            <div className="gameFlash">
                {title}
            </div>
        )
    }
}