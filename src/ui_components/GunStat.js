import React from "react";

export class GunStat extends React.Component {
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