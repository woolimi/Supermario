const mario = document.querySelector('#mario')
const screen = document.querySelector('#screen')
const links = document.querySelectorAll('nav li')
document.querySelector('#retry').addEventListener('click', createBars)
const jumpPower = 40
let isKeyDown = []
let x = mario.offsetLeft
let y = screen.offsetHeight - mario.offsetHeight - mario.offsetTop // bottom 값으로 만들어 주기
let xVelocity = 0
let yVelocity = 0
let isJump = false
let jumpOverSurface = []
let openLink = false
let bars
let LR = true // left :false, right: true

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
  for (let i = 0; i < 15; i++) {
    const bar = document.createElement('div')
    bar.className = 'bars'
    bar.id = `bar${i}`
    bar.style.left = `${Math.floor(Math.random() * (screen.offsetWidth - 100))}px`
    bar.style.bottom = `${Math.floor(Math.random() * 300) + 150}px`// 200 ~ 400 px 사이
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
  if (y < 78) {
    isJump = false
    y = 78
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
      mario.classList.add('jumpR')
    } else { // no jump
      mario.className = ''
      mario.classList.add('stopR')
    }
  } else { // left
    if (isJump) { // jump
      mario.className = ''
      mario.classList.add('jumpL')
    } else { // no jump
      mario.className = ''
      mario.classList.add('stopL')
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
    if (y > screen.offsetHeight - link.offsetHeight) {
      y = screen.offsetHeight - link.offsetHeight
      yVelocity = 0
      if (!openLink) {
        if (idx === links.length - 1) {
          createBars()
        } else {
          console.log(`link${idx}`)
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
