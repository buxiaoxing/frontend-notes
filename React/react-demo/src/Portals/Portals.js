import React, { Component } from 'react'
import ReactDOM from 'react-dom';

function ChildA(){
  return <div>
    ChildA
  </div>
}
function ChildB(){
  return <div>
    ChildB
  </div>
}

export default class Portals extends Component {
  render() {
    return (
      <div>Portals
        <ChildA />
        {
          ReactDOM.createPortal(<ChildB />, document.getElementById("mask"))
        }
      </div>
    )
  }
}
