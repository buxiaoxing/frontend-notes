import React, { PureComponent } from 'react'
import "./index.css"

export default class MovablePanel extends PureComponent {
  state={
    x: 0,
    y: 0
  }
  divRef = React.createRef()
  handleMouseMove = (e)=>{
    const rect = this.divRef.current.getBoundingClientRect()
    const x = e.pageX - rect.left
    const y = e.pageY - rect.top
    this.setState({
      x,y
    })

  }
  render() {
    return (
      <div ref={this.divRef} className='wrapper' onMouseMove={this.handleMouseMove}>
        <div style={{
          width: 100,
          height: 100,
          background: "#f40",
          position: "absolute",
          top: this.state.y - 50,
          left: this.state.x - 50
        }}></div>
      </div>
    )
  }
}
