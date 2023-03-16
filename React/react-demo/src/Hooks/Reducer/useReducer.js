import {useState} from "react"
/**
 * 
 * @param {Function} reducer 
 * @param {any} initVal 
 * @param {Function} initValFun 
 */
export function useReducer(reducer, initVal, initValFun){
  const [state, setState] = useState(initValFun?initValFun(initVal): initVal)
  function dispatch(action){
    const newState = reducer(state, action)
    console.log(`日志：n的值 ${state} -> ${newState}`)
    setState(newState)
  }

  return [state, dispatch]
}