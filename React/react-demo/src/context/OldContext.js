import React, { Component } from 'react'
import PropTypes from "prop-types";

const types = {
  a: PropTypes.number,
  b: PropTypes.string
}

class ChildA extends React.Component{
  static contextTypes = types
  render(){
    return (
      <div>ChildA a:{this.context.a} b:{this.context.b}</div>
    )
  }
}

function ChildB(props, context){
  return (
    <div>ChildB a:{context.a} b:{context.b}</div>
  )
}
ChildB.contextTypes = types


export default class OldContext extends Component {
  static childContextTypes = types
  getChildContext(){
    return {
      a: 123,
      b: "abc"
    }
  }
  render() {
    return (
      <div>OldContext <ChildA /> <ChildB /></div>
      
    )
  }
}
