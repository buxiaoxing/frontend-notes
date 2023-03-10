import React, { Component } from 'react'

function A(props, ref){
  return <h1 ref={ref}>
    A
  </h1>
}

class B extends React.Component{

  render(){
    return (
      <h1 ref={this.props.forwardRef}>
        B
      </h1>
    )
  }
}

const NewA = React.forwardRef(A)
const NewB = React.forwardRef((props, ref)=>(
  <B forwardRef={ref}></B>
))
export default class ForwardRef extends Component {
  ARef = React.createRef()
  BRef = React.createRef()
  componentDidMount(){
    // console.log(this.ARef)
    // console.log(this.BRef)
    console.log("didmount")
  }
  render() {
    return (
      <div>
        <NewA ref={this.ARef} />
        <NewB ref={this.BRef} />
      </div>
    )
  }
}
