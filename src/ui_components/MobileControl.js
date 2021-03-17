import React from "react"
import Draggable from 'react-draggable';

export class MobileControl extends React.Component {
    constructor(props){
       super(props)
       this.handleStart = this.handleStart.bind(this)
       this.handleDrag = this.handleDrag.bind(this)
       this.handleStop = this.handleStop.bind(this)
       this.state = {
        vector: {x:0,y:0}
       }
    }

    handleStart(e){
        console.log("Starting Drag",e)
    }

    handleDrag(e){
        console.log("Dragging",e.x,e.y)
        this.setState({vector:{x:e.x,y:e.y}})
    }

    handleStop(e){
        console.log("Stopping Drag",e)
        this.setState({vector:{x:0,y:0}})
    }

    render(){
        return (
        <div className="touchpad">
            <Draggable
                handle=".handle"
                axis="both"
                defaultPosition={{x:0,y:0}}
                bounds="parent"
                position={null}
                scale={1}
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}
            >
                <div className="handle"></div>
            </Draggable>
        </div>)
    } 
}