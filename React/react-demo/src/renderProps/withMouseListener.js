import React, {PureComponent} from 'react'

export default function withMouseListener(Comp) {
  return class extends PureComponent {
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
          <Comp {...this.props} x={this.state.x} y={this.state.y} />
        </div>
      )
    }
  }
}
