const mario = document.querySelector('#mario')
const screen = document.querySelector('#screen')
const link1 = document.querySelector('#link1')
const obstacle1 = document.querySelector('#obstacle1')
let isKeyDown = []
let x
let y
let xVelocity = 0
let yVelocity = 0
let isJump = false
let openLink = false

document.onkeydown = onKeyDown
document.onkeyup = onKeyUp

setInterval(gameLoop, 20)

function onKeyDown (e) {
  isKeyDown[e.keyCode] = true
}

function onKeyUp (e) {
  delete isKeyDown[e.keyCode]
}

function gameLoop () {
  x = mario.offsetLeft
  y = screen.offsetHeight - mario.offsetHeight - mario.offsetTop // bottom 값으로 만들어 주기

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

  // link1
  makeBar(link1)

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
  yVelocity = 90
  isJump = true
}

function moveDown () {
  yVelocity -= 2
}

function makeBar (bar) {
  const surface = screen.offsetHeight - bar.offsetTop
  const barY = screen.offsetHeight - bar.offsetTop - bar.offsetHeight - mario.offsetHeight // 밑변
  const barX = bar.offsetLeft
  if (y === surface &&
   barX - mario.offsetWidth < x &&
   x < (barX + bar.offsetWidth)) {
    y = surface
    yVelocity = 0
  } else if (y > barY &&
    y < surface &&
    barX - mario.offsetWidth < x &&
    x < (barX + bar.offsetWidth)) {
    y = barY
    yVelocity = 0
    if (!openLink) {
      console.log('link')
      // window.open('http://woolimi.github.io', '_blank')
      openLink = true
      isKeyDown = []
    }
  } else {
    openLink = false
  }
}
