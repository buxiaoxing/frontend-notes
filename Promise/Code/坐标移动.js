function move(line) {
  let x = 0
  let y = 0
  const arr = line.split(";")
  let reg = /^(A|S|D|W){1}[0-9]{1,2}$/
  for (let item of arr) {
    if (reg.test(item)) {
      let direction = item[0]
      let distance = +item.slice(1)
      switch (direction) {
        case "A":
          x -= distance
          break
        case "S":
          y -= distance
          break
        case "D":
          x += distance
          break
        case "W":
          y += distance
          break
        default:
          break
      }
    }
  }
  console.log(x, y)
}
move("A10;S20;W10;D30;X;A1A;B10A11;;A10;")