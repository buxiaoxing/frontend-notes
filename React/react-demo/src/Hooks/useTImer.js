/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: juncheng.wu juncheng.wu@bst.ai
 * @Date: 2023-03-16 18:19:12
 * @LastEditors: juncheng.wu juncheng.wu@bst.ai
 * @LastEditTime: 2023-03-16 19:35:55
 * @Description: 
 */
import {useEffect} from 'react'

export default function useTImer(callback, duration) {
  useEffect(() => {
    const timer = setInterval(callback, duration)
  
    return () => {
      clearInterval(timer)
    }
  }, [])
  
}
