
let numBalls = 50;
let spring = 0.1;
let gravity = 0.5; // 0.5
let friction = -.95;
let balls = [];

let borderSize = 0;

let pallete = [[45, 44, 45], [91, 84, 81], [164, 126, 111], [237, 206, 181], [217, 168, 123]];
let palleteLoaded = false;

let cnv;
let pg0;
let pg1;
let img = [];

let rotationVal = 0;
let rotationBaseSpeed = (Math.PI / 180) * 1;
let rotationSpeed = rotationBaseSpeed;

const Y_AXIS = 1;
const X_AXIS = 2;
let b1, b2, c1, c2;

function preload() {
  for (let i = 0; i < 6; i++) {
    img[i] = loadImage(`img/face_${i}.png`);
    console.log(`img/face_${i}.png`);
  }
}

function setup() {

  var cnv = createCanvas(windowWidth - borderSize*2, windowHeight - borderSize*2);
  cnv.style('display', 'block');
  noStroke();

  pg0 = createGraphics(width, height);
  pg0.noStroke();

  pg1 = createGraphics(width / 1.8, 1);
  pg1.noStroke();
  pg1.translate(0, height/2);
  pg1.scale(1, -1);

  var url = "http://colormind.io/api/";
  var data = {
    model : "default"
  }

  // Define colors
  b1 = color(255);
  b2 = color(0);
  c1 = color(204, 102, 0);
  c2 = color(0, 102, 153);

  setupAfterLoad();

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

  background(...pallete[0]);

  for (let i = 0; i < numBalls; i++) {
    colorIndex = i%(pallete.length-1)+1
    balls[i] = new Ball(
      random(width), // width
      random(height), // height
      random(30), // 30
      i,
      balls,
      pallete[colorIndex],
      img[0]
    );
  }

}

function windowResized() {
  resizeCanvas(windowWidth - borderSize*2, windowHeight - borderSize*2);
}

const randoColor = () => pallete[Math.floor(Math.random() * (pallete.length - 1)) + 1];

function draw() {

  translate (width / 2, height / 2);

  rotate(rotationVal += rotationBaseSpeed);

  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display(pg0);
  });

  pg1.copy(pg0, 0, Math.floor(height / 2), width, Math.floor(height / 2), 0, 0, Math.floor(width), Math.floor(height / 2));

  image(pg1, 0, 0);

}

class Ball {
  constructor(xin, yin, din, idin, oin, color, picture) {
    this.x = xin;
    this.y = yin;
    this.vx = 1000;
    this.vy = 0;
    this.diameter = 1;
    this.id = idin;
    this.others = oin;
    this.color = color;
    this.alpha = 0;
    this.picture = picture;
    this.img = createGraphics(300, 300);
    this.showImg = random();
    this.canChangeColor = true;
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
        this.changeColor();
        this.others[i].changeColor();
      }
    }
  }

  move() {
    this.vy += gravity;
    this.x += sin(this.vx);
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

  display(img) {
    if (this.showImg < 0.01) {
      this.img.background(0, 0, 0, 0);
      this.img.image(this.picture, 0, 0, 300, 300);
      this.img.translate(Math.floor(300 / 2), Math.floor(300 / 2))
      this.img.translate(-Math.floor(300 / 2), -Math.floor(300 / 2))
      img.image(this.img, this.x, this.y);
    } else {
      img.fill(this.color);
      img.ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }

  changeColor() {
    if (this.canChangeColor) {
      this.color = pallete[Math.floor(Math.random() * 4) + 1];
      this.canChangeColor = false;
      setTimeout(() => { this.canChangeColor = true }, 100);
    }
  }

}
