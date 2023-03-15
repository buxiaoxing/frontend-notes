import React, { useEffect, useState, useRef } from 'react'

let params = 123
Timer(params)


export default function Timer(props) {
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
