import React, { Component } from 'react'
import Form from './Form'
export default class Test extends Component {
  render() {
    return (
      <div>
        <Form  initValue={{username: "hello", password: "123"}} onSubmit={(data)=>{
          console.log(data)
        }}>
          <div>
            用户名：
            <Form.Input name="username"/>
          </div>
          <div>
            密码：
            <Form.Input name="password" type="password" />
          </div>
          <div>
            <Form.Button>提交</Form.Button>
          </div>
        </Form>
      </div>
    )
  }
}
