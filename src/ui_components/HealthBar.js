import React from "react";

export class HealthBar extends React.Component {
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