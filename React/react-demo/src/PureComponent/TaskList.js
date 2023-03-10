import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Task from './Task'
export default class TaskList extends PureComponent {
  static propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      isFinish: PropTypes.bool.isRequired
    })).isRequired
  }
  render() {
    console.log("TaskList render")
    const taskList = this.props.tasks.map((item, index)=>
      <Task key={index} {...item}/>
    )
    return (
      <ul>
        {taskList}
      </ul>
    )
  }
}
