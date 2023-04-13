const canvas = document.getElementById("canvas");
canvas.width = 550;
canvas.height = 320;
const context = canvas.getContext("2d");

const player1Markcount = document.getElementById("player1__markcount");
const player2Markcount = document.getElementById("player2__markcount");

const updatePunctuation = (puncObj) => {
  player1Markcount.innerHTML = puncObj.player1
    ? puncObj.player1
    : player1Markcount.innerHTML;
  player2Markcount.innerHTML = puncObj.player2
    ? puncObj.player2
    : player2Markcount.innerHTML;
};

updatePunctuation({
  player1: 0,
  player2: 0,
});

const randomizeXSpeed = (ySpeed) => {
  const xSpeed = ySpeed * Math.random() + 1 * 4.5;
  return xSpeed;
};

const getPlayerInput = (callback) => {
  let pressedKey = null;
  window.addEventListener("keydown", ({ key }) => {
    pressedKey = key;
  });
  window.addEventListener("keyup", ({ key }) => {
    if (key === pressedKey) {
      pressedKey = null;
    }
  });
  const update = () => {
    callback(pressedKey);
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

class Paddle {
  constructor(x = 0, color = "green", size = 10, speed = 5) {
    this.x = x;
    this.w = size;
    this.h = size * 6;
    this.y = canvas.height / 2 - this.h / 2;
    this.color = color;
    this.speed = speed;
  }
  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
  }
  moveY(direction) {
    const update = () => {
      const canMoveUp = this.y > 0;
      const canMoveDown = this.y < canvas.height - this.h;
      if (direction === "up" && canMoveUp) {
        this.y -= this.speed;
      } else if (direction === "down" && canMoveDown) {
        this.y += this.speed;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
}

const paddles = [
  new Paddle(35, "white", 10, (speed = 8)),
  new Paddle(canvas.width - 35 - 10, "white", 10, (speed = 8)),
];

class Ball {
  constructor(
    color = "black",
    size = 10,
    speed = 5,
    xDirection = "right",
    yDirection = "up"
  ) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = size;
    this.color = color;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
    this.ySpeed = speed;
    this.xSpeed = 2;
  }
  draw() {
    if (this.xDirection === "right") {
      const [_, paddle] = paddles;
      const hasCollapseInPaddle =
        this.x + this.size > paddle.x &&
        this.x + this.size < paddle.x + paddle.w &&
        this.y > paddle.y - this.y / 8 &&
        this.y < paddle.y + paddle.h + this.y / 8;
      const hasCollapseInWall = this.x > canvas.width - paddle.w;
      if (!hasCollapseInWall && !hasCollapseInPaddle) {
        this.x += this.xSpeed;
      } else {
        this.xDirection = "left";
        this.xSpeed = randomizeXSpeed(this.ySpeed);
        if (hasCollapseInWall) {
          updatePunctuation({
            player1: Number(player1Markcount.innerHTML) + 1,
            player2: null,
          });
        }
      }
    } else if (this.xDirection === "left") {
      const [paddle, _] = paddles;
      const hasCollapseInPaddle =
        this.x + this.size > paddle.x &&
        this.x + this.size < paddle.x + paddle.w &&
        this.y > paddle.y - this.y / 8 &&
        this.y < paddle.y + paddle.h + this.y / 8;
      const hasCollapseInWall = this.x <= 0;
      if (!hasCollapseInPaddle && !hasCollapseInWall) {
        this.x -= this.xSpeed;
      } else {
        this.xDirection = "right";
        this.xSpeed = randomizeXSpeed(this.ySpeed);
        if (hasCollapseInWall) {
          updatePunctuation({
            player1: null,
            player2: Number(player2Markcount.innerHTML) + 1,
          });
        }
      }
    }
    if (this.yDirection === "up") {
      if (this.y > 0) {
        this.y -= this.ySpeed;
      } else this.yDirection = "down";
    } else if (this.yDirection === "down") {
      if (this.y < canvas.height - 10) {
        this.y += this.ySpeed;
      } else this.yDirection = "up";
    }
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

const newBall = new Ball("red", (size = 10), (speed = 3.5), "right", "up");

class Net {
  constructor() {
    this.x = canvas.width / 2;
    this.h = canvas.height * 0.8;
    this.y = canvas.height / 2 - this.h / 2;
    this.w = 10;
    this.color = "gray";
  }
  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
  }
}

const newNet = new Net();

const update = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  newNet.draw();
  newBall.draw();
  paddles.forEach((pala) => pala.draw());
  requestAnimationFrame(update);
};

requestAnimationFrame(update);

// grabbing user's input

getPlayerInput((pressedKey) => {
  const [paddle1, paddle2] = paddles;
  switch (pressedKey) {
    case "w":
      paddle1.moveY("up");
      break;
    case "s":
      paddle1.moveY("down");
      break;
    case "ArrowUp":
      paddle2.moveY("up");
      break;
    case "ArrowDown":
      paddle2.moveY("down");
      break;
    default:
      break;
  }
});
