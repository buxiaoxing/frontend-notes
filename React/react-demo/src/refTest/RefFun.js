import React, { Component } from 'react'

export default class RefFun extends Component {
  handleClick(){
    this.txt.focus()
  }
  getRef = (el)=>{
    this.txt = el
  }
  render() {
    return (
      <div>
        <input ref={this.getRef} type="text" />
        <button onClick={()=>{this.handleClick()}}>聚焦</button>
      </div>
    )
  }
}
