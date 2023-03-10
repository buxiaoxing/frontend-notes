function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

class SuperTask {
  constructor() {
    this._thread1 = true
    this._thread2 = true
    this.list = []
  }
  getThread1() {
    return this._thread1
  }
  setThread1(value) {
    
    this._thread1 = value
    value && this.execTimer()
  }
  getThread2() {
    return this._thread2
  }
  setThread2(value) {
    
    this._thread2 = value
    value && this.execTimer()
  }
  add(timer) {
    if (this.getThread1() || this.getThread2()) {
      let isThread1 = this.getThread1()
      isThread1 ? this.setThread1(false) : this.setThread2(false)
      return timer().then(() => {
        isThread1 ? this.setThread1(true) : this.setThread2(true)
      })
    }
    return new Promise((resolve) => {

      this.list.push({
        timer,
        resolve
      })
    })
  }

  execTimer() {
    if (this.list.length) {
      const exec = this.list.shift()
      let isThread1 = this.getThread1()
      isThread1 ? this.setThread1(false) : this.setThread2(false)
      exec.timer().then(() => {
        isThread1 ? this.setThread1(true) : this.setThread2(true)
        exec.resolve()
      })
    }
  }
}

const superTask = new SuperTask()
let datebase = new Date()
function addTask(time, name) {
  superTask.add(() => timeout(time)).then(() => {
    let date = new Date()
    let duration = date.getTime() - datebase.getTime()
    console.log(name + "完成" + duration.toString())
  })
}

addTask(10000, 1)
addTask(5000, 2)
addTask(3000, 3)
addTask(4000, 4)
addTask(5000, 5)