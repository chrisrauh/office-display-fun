
let numBalls = 16;
let spring = 0.05;
let gravity = 0.1;
let friction = -0.1;
let balls = [];

let borderSize = 15;

let pallete = [[45, 44, 45], [91, 84, 81], [164, 126, 111], [237, 206, 181], [217, 168, 123]];
let palleteLoaded = false;

function setup() {

  var url = "http://colormind.io/api/";
  var data = {
    model : "default"
  }

  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
  }).then(response => response.json())
    .then(responsejson => responsejson.result)
    .then(result => {
      pallete = result;
      palleteLoaded = true;
      console.log('Success:', pallete);
      setupAfterLoad();
    })
    .catch(error => console.error('Error:', error));

}

function setupAfterLoad() {

  var cnv = createCanvas(windowWidth - 100, windowHeight - 100);
  cnv.style('display', 'block');
  for (let i = 0; i < numBalls; i++) {
    colorIndex = i%(pallete.length-1)+1
    balls[i] = new Ball(
      random(width),
      random(height),
      random(10, 60),
      i,
      balls,
      pallete[colorIndex],
    );
  }

  noStroke();
  background(...pallete[0]);

}

function mousePressed() {

  // Set the value of fullscreen
  // into the variable
  let fs = fullscreen();

  // Call to fullscreen function
  fullscreen(!fs);
}

function windowResized() {
  resizeCanvas(windowWidth - 100, windowHeight - 100);
}

const randoColor = () => pallete[Math.floor(Math.random() * (pallete.length - 1)) + 1];

function draw() {
  textSize(60);
  textAlign(CENTER);
  text('Remember James loves you!', width/2, height/2);
  fill(0,0,0);
  if (palleteLoaded) {
    balls.forEach(ball => {
      ball.collide();
      ball.move();
      ball.display();
    });
  }

}

class Ball {
  constructor(xin, yin, din, idin, oin, color) {
    this.x = xin;
    this.y = yin;
    this.vx = 3;
    this.vy = -0.1;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.color = color;
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
    fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}