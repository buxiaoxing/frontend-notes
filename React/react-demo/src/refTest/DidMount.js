import React, { Component } from 'react'

export default class DidMount extends Component {
  componentDidMount(){
    console.log("didmount")
  }
  render() {
    return (
      <div>DidMount</div>
    )
  }
}
