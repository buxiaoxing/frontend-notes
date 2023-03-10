import React from 'react'
import MovablePanel from './MovablePanel'
import ShowMousePoint from './ShowMousePoint'
import MouseListener from './MouseListener'
import withMouseListener from './withMouseListener'
import "./index.css"

function Point(props) {
  return <>x: {props.x}, y: {props.y}</>
}

function Panel(props) {
  return <div style={{
    width: 100,
    height: 100,
    background: "#f40",
    position: "absolute",
    top: props.y - 50,
    left: props.x - 50
  }}></div>
}
const MousePoint = withMouseListener(Point)
const MousePanel = withMouseListener(Panel)
export default function RenderPropsTest() {
  return (
    // <>
    //   <MovablePanel />
    //   <ShowMousePoint />
    // </>
    // <>
    //   <MouseListener>
    //     {
    //       (mouse)=>(
    //         <div style={{
    //           width: 100,
    //           height: 100,
    //           background: "#f40",
    //           position: "absolute",
    //           top: mouse.y - 50,
    //           left: mouse.x - 50
    //         }}></div>
    //       )
    //     }
    //   </MouseListener>
    //   <MouseListener>
    //     {
    //       (mouse)=>(
    //         <>x: {mouse.x}, y: {mouse.y}</>
    //       )
    //     }
    //   </MouseListener>
    // </>
    <>
      <MousePoint />
      <MousePanel />
    </>
  )
}
