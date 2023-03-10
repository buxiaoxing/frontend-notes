import React, { Component } from 'react'


const ctx1 = React.createContext()

class ChildA extends React.Component {
  static contextType = ctx1
  render() {
    return (
      <div>
        <h2>ChildA </h2>
        <div>a: {this.context.a}, b:{this.context.b}</div>
        <ChildB />
      </div>
    )
  }
}

function ChildB() {
  return (
    <>
      <h2>ChildB</h2>
      <ctx1.Consumer>
        {
          (value)=>(
            <div>a: {value.a}, b:{value.b}</div>
          )
        }
      </ctx1.Consumer>
    </>
  )
}

export default class NewContext extends Component {


  state = {
    a: 123,
    b: "hello"
  }
  render() {
    return (
      <ctx1.Provider value={this.state} >
        <h1>NewContext </h1>
        <ChildA />
      </ctx1.Provider>
    )
  }
}
