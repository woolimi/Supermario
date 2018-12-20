const mario = document.querySelector('#mario')
const screen = document.querySelector('#screen')
const links = document.querySelectorAll('nav li')
document.querySelector('#retry').addEventListener('click', createBars)
let bars = document.querySelectorAll('.bars')

function createBars () {
  // 기존 bar가 존재하면 삭제
  if (bars) {
    for (let i = 0; i < bars.length; i++) {
      screen.removeChild(bars[i])
    }
  }
  bars = []
  // 새로운 bar 생성
  for (let i = 0; i < 20; i++) {
    const bar = document.createElement('div')
    bar.className = 'bars'
    bar.id = `bar${i}`
    bar.style.left = `${Math.floor(Math.random() * 1000)}px`// 0 ~ 800 px 사이
    bar.style.bottom = `${Math.floor(Math.random() * 400)}px`// 0 ~ 400 px 사이
    screen.appendChild(bar)
  }
  bars = document.querySelectorAll('.bars')
}
createBars()

const jumpPower = 80
let isKeyDown = []
let x = mario.offsetLeft
let y = screen.offsetHeight - mario.offsetHeight - mario.offsetTop - 2 // bottom 값으로 만들어 주기
let xVelocity = 0
let yVelocity = 0
let isJump = false
let jumpOverSurface = Array(2).fill(false)
let openLink = false

document.onkeydown = onKeyDown
document.onkeyup = onKeyUp

setInterval(gameLoop, 20)

function gameLoop () {
  if (isKeyDown[38] && !isJump) {
    // up arrow
    moveUp()
  }

  if (isKeyDown[40]) {
    // down arrow
    moveDown()
  }

  if (isKeyDown[37]) {
    // left arrow
    moveLeft()
  }

  if (isKeyDown[39]) {
    // right arrow
    moveRight()
  }
  yVelocity -= 1.5 // gravity
  x += xVelocity
  y += yVelocity
  xVelocity *= 0.8 // friction
  yVelocity *= 0.8 // friction

  // if charactor is out of ground
  if (y < 0) {
    isJump = false
    y = 0
    yVelocity = 0
  }

  // if mario is going off the left of the screen
  if (x < 0) {
    x = screen.offsetWidth
  } else if (x > screen.offsetWidth) { // if mario goes past right boundary
    x = 0
  }

  bars.forEach(function (bar, idx) {
    putBars(bar, idx)
  })

  links.forEach(function (link, idx) {
    touchLink(link, idx)
  })

  touchLink()
  // drawing
  mario.style.left = `${x}px`
  mario.style.bottom = `${y}px`
}

// how to move
function moveRight () {
  xVelocity += 2
}

function moveLeft () {
  xVelocity -= 2
}

function moveUp () {
  yVelocity = jumpPower
  isJump = true
}

function moveDown () {
  yVelocity -= 2
}

function putBars (bar, idx) {
  const surface = screen.offsetHeight - bar.offsetTop - 4
  const barX = bar.offsetLeft

  if (barX - mario.offsetWidth < x && x < (barX + bar.offsetWidth)) {
    // 표면 위로 점프할 경우 jumpOverSurface 를 true로 바꾼다
    if (y > surface) {
      jumpOverSurface[idx] = true
    }
    if (y < surface && jumpOverSurface[idx]) {
      y = surface
      yVelocity = 0
      isJump = false
    }
  } else {
    jumpOverSurface[idx] = false
  }
}

function touchLink (link, idx) {
  const linkX = idx * 66
  // console.log(link.offsetLeft)
  // const linkX = link.offsetLeft
  if (linkX - mario.offsetWidth < x && x < (linkX + link.offsetWidth)) {
    if (y > screen.offsetHeight - 46) {
      y = screen.offsetHeight - 46
      yVelocity = 0
      if (!openLink) {
        console.log(`link${idx}`)
      }
    }
  }
}

function onKeyDown (e) {
  isKeyDown[e.keyCode] = true
}

function onKeyUp (e) {
  delete isKeyDown[e.keyCode]
}
