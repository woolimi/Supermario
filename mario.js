const mario = document.querySelector('#mario')
const screen = document.querySelector('#screen')
const links = document.querySelectorAll('nav li')
document.querySelector('#retry').addEventListener('click', createBars)
document.querySelector('#left').addEventListener('touchstart', function () {
  isKeyDown[37] = true
})
document.querySelector('#left').addEventListener('touchend', function () {
  isKeyDown[37] = false
})
document.querySelector('#right').addEventListener('touchstart', function () {
  isKeyDown[39] = true
})
document.querySelector('#right').addEventListener('touchend', function () {
  isKeyDown[39] = false
})
document.querySelector('#jump').addEventListener('touchstart', function () {
  isKeyDown[38] = true
})
document.querySelector('#jump').addEventListener('touchend', function () {
  isKeyDown[38] = false
})
const linkAdress = [
  'https://woolimi.github.io',
  'https://google.com',
  'https://www.w3schools.com/']
const jumpPower = screen.offsetHeight / 15
const groundHeight = screen.offsetHeight * 0.135
const numBars = Math.floor(screen.offsetHeight * 0.015)
let isKeyDown = []
let x = mario.offsetLeft
let y = screen.offsetHeight - mario.offsetHeight - mario.offsetTop // bottom 값으로 만들어 주기
let xVelocity = 0
let yVelocity = 0
let isJump = false
let isRunR = false
let isRunL = false
let jumpOverSurface = []
let openLink = false
let bars
let LR = true // left :false, right: true
let runRInterval
let runLInterval
let runMotion = 0 // 0 or 1

createBars()

function createBars () {
  // 기존 bar가 존재하면 삭제
  if (bars) {
    for (let i = 0; i < bars.length; i++) {
      screen.removeChild(bars[i])
    }
  }
  bars = []
  // 새로운 bar 생성
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div')
    bar.className = 'bars'
    bar.id = `bar${i}`
    bar.style.left = `${Math.floor(Math.random() * (screen.offsetWidth - screen.offsetWidth * 0.35))}px`
    bar.style.bottom = `${Math.floor(Math.random() * screen.offsetHeight * 0.65) + groundHeight * 1.2}px`// 200 ~ 400 px 사이
    screen.appendChild(bar)
  }
  bars = document.querySelectorAll('.bars')
}

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
  if (y < groundHeight) {
    isJump = false
    y = groundHeight
    yVelocity = 0
  }

  // if mario is going off the left of the screen
  if (x < 0) {
    x = screen.offsetWidth - mario.offsetWidth
  } else if (x > screen.offsetWidth - mario.offsetWidth) { // if mario goes past right boundary
    x = 0
  }

  bars.forEach(function (bar, idx) {
    putBars(bar, idx)
  })

  links.forEach(function (link, idx) {
    touchLink(link, idx)
  })

  // drawing
  if (LR) { // right
    if (isJump) { // jump
      mario.className = ''
      mario.className = 'jumpR'
    } else { // no jump
      if (isKeyDown[39] && !isKeyDown[37]) { // rightkey down and leftKey up
        clearInterval(runLInterval)
        if (!isRunR) {
          let runFps = 50
          runRInterval = setInterval(function () {
            mario.className = ''
            if (runMotion) {
              mario.className = 'runR1'
              runMotion = 0
            } else {
              mario.className = 'runR2'
              runMotion = 1
            }
          }, runFps)
        }
        isRunR = true
      } else {
        clearInterval(runRInterval)
        mario.className = ''
        mario.className = 'stopR'
        isRunR = false
      }
    }
  } else { // left
    if (isJump) { // jump
      mario.className = ''
      mario.className = 'jumpL'
    } else { // no jump
      if (isKeyDown[37] && !isKeyDown[39]) { // leftkey down and rightkey up
        clearInterval(runRInterval)
        if (!isRunL) {
          let runFps = 50
          runLInterval = setInterval(function () {
            mario.className = ''
            if (runMotion) {
              mario.className = 'runL1'
              runMotion = 0
            } else {
              mario.className = 'runL2'
              runMotion = 1
            }
          }, runFps)
        }
        isRunL = true
      } else {
        clearInterval(runLInterval)
        mario.className = ''
        mario.className = 'stopL'
        isRunL = false
      }
    }
  }
  mario.style.left = `${x}px`
  mario.style.bottom = `${y}px`
}

// how to move
function moveRight () {
  xVelocity += 2
  LR = true
}

function moveLeft () {
  xVelocity -= 2
  LR = false
}

function moveUp () {
  yVelocity = jumpPower
  isJump = true
}

function moveDown () {
  yVelocity -= 2
}

function putBars (bar, idx) {
  const surface = screen.offsetHeight - bar.offsetTop + 1
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
  const linkX = link.offsetLeft
  if (linkX - mario.offsetWidth < x && x < (linkX + link.offsetWidth)) {
    if (y > screen.offsetHeight - link.offsetHeight * 1.8) {
      y = screen.offsetHeight - link.offsetHeight * 1.8
      yVelocity = 0
      if (!openLink) {
        if (idx === links.length - 1) {
          createBars()
        } else {
          window.location.href = linkAdress[idx]
          if (document.querySelector('li a.active')) {
            document.querySelector('li a.active').classList.remove('active')
          }
          link.childNodes[0].classList.add('active')
        }
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
