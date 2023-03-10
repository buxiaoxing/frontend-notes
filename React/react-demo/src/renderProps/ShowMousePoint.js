import React, { PureComponent } from 'react'
import "./index.css"

export default class ShowMousePoint extends PureComponent {
  state={
    x: 0,
    y: 0
  }
  divRef = React.createRef()
  handleMouseMove = (e)=>{
    const rect = this.divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    this.setState({
      x,y
    })

  }
  render() {
    return (
      <div ref={this.divRef} className='wrapper' onMouseMove={this.handleMouseMove}>
        x: {this.state.x}, y: {this.state.y}
      </div>
    )
  }
}
