/*
 * @Author: juncheng.wu juncheng.wu@bst.ai
 * @Date: 2023-03-16 09:33:51
 * @LastEditors: juncheng.wu juncheng.wu@bst.ai
 * @LastEditTime: 2023-03-16 17:51:58
 * @Description: 
 */
import React, { useEffect, useState, useRef } from 'react'

function useTime(num){
  const [time, setTime] = useState(0)
  if(num){
    setTime(num)
  }
  return [time]
}

export default function Timer() {
  // console.log(props)
  // const [time, setTime] = useState(0)
  const [time, setTime] = useState(0)
  useEffect(()=>{
    // setInterval(()=>{
    //   timeRef.current = timeRef.current + 1
    //   setTime(timeRef.current)
    // }, 1000)
    setTimeout(()=>{
      setTime(time+1)
    }, 1000)
  }, [time])
  
  return (
    <div>{time}</div>
  )
}
