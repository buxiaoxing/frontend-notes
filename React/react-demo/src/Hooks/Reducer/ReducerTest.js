/*
 * @Author: juncheng.wu juncheng.wu@bst.ai
 * @Date: 2023-03-16 19:37:38
 * @LastEditors: juncheng.wu juncheng.wu@bst.ai
 * @LastEditTime: 2023-03-16 19:49:58
 * @Description: 
 */

import React, { useReducer } from 'react'
// import { useReducer } from './useReducer'

function reducer(state, action){
  switch(action.type){
    case "increase":
      return state + 1
    case "decrease":
      if(state === 0){
        return 0
      }
      return state - 1
    default:
      return state
  }
}

export default function ReducerTest() {
  const [state, dispatch] = useReducer(reducer, 0, (n)=>n+1)
  return (

    <div>
      <button onClick={()=>{
        // setN((oldVal)=>oldVal-1)
        dispatch({
          type: "decrease"
        })
      }}>n-1</button>
      {state}
      <button onClick={()=>{
        // setN(oldVal=>oldVal+1)
        dispatch({
          type: "increase"
        })
      }}>n+1</button>
    </div>
  )
}
