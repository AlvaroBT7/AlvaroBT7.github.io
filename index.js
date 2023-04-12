const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 350;
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
  moveY(yOffset, direction) {
    const update = () => {
      const canMoveUp = this.y > 0;
      const canMoveDown = this.y < canvas.height - this.h;
      if (direction === "up" && canMoveUp) {
        this.y -= this.speed;
      } else if (direction === "down" && canMoveDown) {
        this.y += this.speed;
      } else return;

      if (yOffset > 0) requestAnimationFrame(update);
      yOffset--;
    };
    requestAnimationFrame(update);
  }
}

const paddles = [
  new Paddle(0, "white", 10, (speed = 8)),
  new Paddle(canvas.width - 10, "white", 10, (speed = 8)),
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
    this.speed = speed;
  }
  draw() {
    if (this.xDirection === "right") {
      if (this.x < canvas.width - 15 - 10) {
        this.x += this.speed * 1.5;
      } else {
        const [_, paddle] = paddles;

        // console.log(`
        //   PADDLE: ${1}
        //   ball y position: ${this.y}
        //   paddle y position: ${paddle.y}
        //   paddle h size: ${paddle.h}
        // `)

        if (this.y < paddle.y || this.y > paddle.y + paddle.h) {
          updatePunctuation({
            player1: Number(player1Markcount.innerHTML) + 1,
            player2: null,
          });
        }
        this.xDirection = "left";
      }
    } else if (this.xDirection === "left") {
      if (this.x > 10) {
        this.x -= this.speed * 1.5;
      } else {
        const [paddle, _] = paddles;

        // console.log(`
        //   PADDLE: ${2}
        //   ball y position: ${this.y}
        //   paddle y position: ${paddle.y}
        //   paddle h size: ${paddle.h}
        // `)

        if (this.y < paddle.y || this.y > paddle.y + paddle.h) {
          updatePunctuation({
            player1: null,
            player2: Number(player2Markcount.innerHTML) + 1,
          });
        }
        this.xDirection = "right";
      }
    }

    if (this.yDirection === "up") {
      if (this.y > 0) {
        this.y -= this.speed;
      } else this.yDirection = "down";
    } else if (this.yDirection === "down") {
      if (this.y < canvas.height - 10) {
        this.y += this.speed;
      } else this.yDirection = "up";
    }

    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

const newBall = new Ball("lime", (size = 10), (speed = 5), "right", "up");

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

window.addEventListener("keydown", ({ key }) => {
  const [paddle1, paddle2] = paddles;

  if (key === "w") paddle1.moveY(4, "up");
  else if (key === "s") paddle1.moveY(4, "down");

  if (key === "ArrowUp") paddle2.moveY(4, "up");
  else if (key === "ArrowDown") paddle2.moveY(4, "down");
});
