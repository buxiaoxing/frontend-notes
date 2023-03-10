import React, { Component } from 'react'
import { Provider } from './formContext'
import PropTypes from 'prop-types'
import FormInput from './FormInput'
import FormButton from './FormButton'
export default class Form extends Component {
  static propTypes = {
    initValue: PropTypes.object,
    onSubmit: PropTypes.func
  }
  static defaultProps = {
    initValue: {}
  }
  state={
    formData: this.props.initValue,
    changeFormData: (name, value)=>{
      this.setState({
        formData: {
          ...this.state.formData,
          [name]: value
        }
      })
    },
    submit: ()=>{
      this.props.onSubmit && this.props.onSubmit(this.state.formData)
    }
  }
  render() {
    return (
      <Provider value={this.state}>
        <div>
          {this.props.children}
        </div>
      </Provider>
    )
  }
}
Form.Input = FormInput
Form.Button = FormButton
