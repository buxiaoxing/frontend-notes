import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Consumer} from './formContext'

export default class FormInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
  }
  static defaultProps = {
    type: "text"
  }
  render() {
    return (
      <Consumer>
        {
          (ctx)=>(
            <input value={ctx.formData[this.props.name] || ""} type={this.props.type} onChange={(e)=>{
              ctx.changeFormData(this.props.name, e.target.value)
            }} />
          )
        }
      </Consumer>
    )
  }
}

