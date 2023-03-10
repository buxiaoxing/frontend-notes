import React, { Component } from 'react'

export default class RefObj extends Component {
  constructor(props){
    super(props)
    // this.txt = React.createRef() // 其实就是创建了一个普通对象
    this.txt = {
      current: null
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(){
    this.txt.current.focus()
  }
  render() {
    return (
      <div>
        <input ref={this.txt} type="text" />
        <button onClick={this.handleClick}>聚焦</button>
      </div>
    )
  }
}
