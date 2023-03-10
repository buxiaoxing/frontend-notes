import React, { PureComponent } from 'react'
import TaskList from './TaskList'
import AddTask from './AddTask'

export default class TaskContainer extends PureComponent {
  state = {
    tasks: []
  }
  componentDidMount(){
    this.setState({
      tasks: new Array(10).fill(0).map((item, index)=>({
        name: "task"+(index+1),
        isFinish: Math.random() > 0.5
      }))
    })
  }
  /**
   * 传递的函数方法提出来，保持更新时传递引用的一致。
   * @param {*} task 
   */
  handleAdd = (task)=>{
    this.setState({
      tasks: [...this.state.tasks, task]
    })
  }
  render() {
    console.log("TaskContainer render, tasks length: "+this.state.tasks.length)
    return (
      <div>
        <AddTask onAdd={this.handleAdd} />
        <TaskList tasks={this.state.tasks} />
      </div>
    )
  }
}
