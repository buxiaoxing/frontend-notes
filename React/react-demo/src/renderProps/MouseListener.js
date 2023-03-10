import React, { PureComponent } from 'react'
import "./index.css"

export default class MouseListener extends PureComponent {
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
        {this.props.children(this.state)}
      </div>
    )
  }
}
