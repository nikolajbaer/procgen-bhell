import React from "react"

export class MobileControl extends React.Component {
    constructor(props){
        super(props)
        this.handleStart = this.handleStart.bind(this)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleStop = this.handleStop.bind(this)
        this.state = {
            handlePos: {x:0,y:0},
        }
    }

    setStateFromTouch(touch,handle_element){
        const clientRect = handle_element.parentElement.getBoundingClientRect()
        let x = clientRect.left + 75 - touch.clientX
        let y = clientRect.top + 75 - touch.clientY
        const l = Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) 
        const v = { x:x/l,y:y/l}
        if( l > 75 ){
            x = v.x * 75
            y = v.y * 75
        }
        this.setState({
            handlePos: {
                x: x,
                y: y,
            }
        })
        this.sendEvent(v)
    }

    sendEvent(v){
        const event = new CustomEvent(this.props.eventName,{detail:{vector:v}})
        window.dispatchEvent(event)
    }

    handleStart(e){
        this.setStateFromTouch(e.touches[0],e.target)
    }

    handleDrag(e){
        this.setStateFromTouch(e.touches[0],e.target)
    }

    handleStop(e){
        this.setState({
            handlePos: {x:0,y:0},
        })
        this.sendEvent({x:0,y:0})
    }

    render(){
        const style = { 
            top: 50 - this.state.handlePos.y,
            left: 50 - this.state.handlePos.x,
        }
        return (
        <div className="touchpad">
            <div style={style} 
                onTouchStart={this.handleStart}
                onTouchEnd={this.handleStop}
                onTouchMove={this.handleDrag}
                className="handle">
            </div>
        </div>)
    } 
}