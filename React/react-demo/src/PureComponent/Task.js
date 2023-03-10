// import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import "./Task.css"
// // import { isEqual } from './helper'
// export default class Task extends PureComponent {
//   static propTypes = {
//     name: PropTypes.string.isRequired,
//     isFinish: PropTypes.bool.isRequired
//   }
//   // shouldComponentUpdate(nextProps, nextState){
//   //   // console.log("shouldComponentUpdate")
//   //   if(isEqual(nextProps, this.props) && isEqual(nextState, this.state)) {
//   //     return false
//   //   }
//   //   return true
//   // }
//   render() {
//     console.log("Task render")
//     return (
//       <li className={this.props.isFinish?"finish":""}>{this.props.name}</li>
//     )
//   }
// }

import React, { PureComponent } from 'react'
function Task(props) {
  return (
    <li className={props.isFinish?"finish":""}>{props.name}</li>
  )
}
Task.propTypes = {
  name: PropTypes.string.isRequired,
  isFinish: PropTypes.bool.isRequired
}
export default React.memo(Task)


function memo(FuncComp){
  return class extends PureComponent{
    render(){
      return FuncComp(this.props)
    }
  }
}

