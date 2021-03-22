import React from "react";

export class MobileStick extends React.Component {
    constructor(props){
        super(props)
        this.canvasRef = React.createRef()
        this.state = {
            x: 0,
            y: 0,
            touch_id: null,
        }

        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)
    }

    handleTouchStart(event){
        if(this.state.touch_id == null){
            this.updateVector(event.touches[0])
        }
    }

    handleTouchMove(event){
        if(this.state.touch_id != null && event.touches[this.state.touch_id]){
            this.updateVector(event.touches[this.state.touch_id])
        }

    }

    handleTouchEnd(event){
        if(this.state.touch_id != null && event.changedTouches[this.state.touch_id]){
            this.setState({ touch_id: null,x: 0,y: 0,})
            this.drawCanvas(null)
        }
    }

    updateVector(touch){
        const client_bounding_rect =  this.canvasRef.current.getBoundingClientRect()

        const p = {
            x: touch.clientX - client_bounding_rect.left,
            y: touch.clientY - client_bounding_rect.top,
        } 

        const w = this.canvasRef.current.width
        const h = this.canvasRef.current.height

        // TODO limit by pull radius
        const max_rad = this.props.width - this.props.pad_radius

        this.setState({
            touch_id: touch.identifier,
            x: (p.x - w/2)/(w/2),
            y: (p.y - h/2)/(h/2),
        })
        // TODO emit event

        this.drawCanvas(p)
    }


    drawCanvas(p){
        const ctx = this.canvasRef.current.getContext('2d');
        const w = this.canvasRef.current.width
        const h = this.canvasRef.current.height
        
        ctx.clearRect(0,0,this.props.width,this.props.height)
        ctx.beginPath()
        ctx.arc(
            w/2,h/2,(this.props.width/2 - this.props.pad_radius),
            0,Math.PI*2
        )
        ctx.strokeStyle = "rgba(200,200,200,0.25)"
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(
            (p==null)?w/2:p.x,
            (p==null)?h/2:p.y,
            this.props.pad_radius,
            0,Math.PI * 2)
        ctx.fillStyle = "rgba(200,200,200,0.5)"
        ctx.strokeStyle = "#888"
        ctx.fill()
        ctx.stroke()
    }

    render(){
        return (
            <div className="mobilestick" id={this.props.joystickId}>
                <div className="debug">
                    {this.state.x.toFixed(2)},{this.state.y.toFixed(2)}
                </div>
                <canvas
                    width={this.props.width}
                    height={this.props.height}
                    ref={this.canvasRef}
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove}
                    onTouchEnd={this.handleTouchEnd}
                ></canvas>
            </div>
        )
    }
}
