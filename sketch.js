let numBalls = 13;
let spring = 0.05;
let gravity = 0.03;
let friction = -0.9;
let balls = [];

function setup() {
  var cnv = createCanvas(windowWidth - 100, windowHeight - 100);
  cnv.style('display', 'block');
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      random(width),
      random(height),
      random(30, 70),
      i,
      balls,
    );
  }
  noStroke();
  fill(255, 204);
}

function mousePressed() {

  // Set the value of fullscreen
  // into the variable
  let fs = fullscreen();

  // Call to fullscreen function
  fullscreen(!fs);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
const randoColor = () => Math.floor(Math.random() * 255) + 1;
const backgroundColor = [
  randoColor(),
  randoColor(),
  randoColor(),
  Math.max(.1, Math.random())
];
const ballColor = () =>  [
  randoColor(),
  randoColor(),
  randoColor(),
];


function draw() {
  background(...backgroundColor);
  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
    fill(...ballColor());
  });
}

class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }

    // const clampRGB = [
    //   Math.floor(Math.random() * 255) + 1,
    //   Math.floor(Math.random() * 255) + 1,
    //   Math.floor(Math.random() * 255) + 1,
    // ];
    // fill(...clampRGB);
  }

  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

class Partical {
  constructor() {
  }
}

console.log(new Partical());