import React, { Component } from 'react'

export default class RefStr extends Component {

  handleClick = (e)=>{
    this.refs.txt.focus()
  }
  render() {
    return (
      <div>
        <input ref="txt" type="text" />
        <button onClick={this.handleClick}>聚焦</button>
      </div>
    )
  }
}
