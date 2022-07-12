const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg,boat;
var canvas, angle, tower, ground, cannon;
var balls = [];
var boats = [];
var backgroundMusic;
var cannonExplosion;
var upbutton;
var downbutton;
var firebutton;
var mutebutton;


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  backgroundMusic = loadSound("./assets/background.mp3")
  cannonExplosion = loadSound("./assets/cannon explosion.mp3")
}

function setup() {
  canvas = createCanvas(1200, 500);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 20

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(170, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(280, 150, 130, 100, angle);
 
  upbutton = createImg("up.png");
  upbutton.position( 450,20);
  upbutton.size(100,100);


downbutton = createImg("down.png");
downbutton.position(630,5);
downbutton.size(100,100);

firebutton = createImg("fire.png");
firebutton.position(800,20);
firebutton.size(100,100);

  mutebutton = createImg('mute.png');
  mutebutton.position(1150,20);
  mutebutton.size(50,50);
  mutebutton.mouseClicked(mute);
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if(!backgroundMusic.isPlaying()){
    backgroundMusic.play();
    backgroundMusic.setVolume(0.9);
  }
  Engine.update(engine);

 
  rect(ground.position.x, ground.position.y, width * 2, 1);
  

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();



  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithBoat(i);
  }

  cannon.display();

}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    cannonExplosion.play();
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    if(ball.body.position.x >= width || ball.body.position.y >= height - 50){
      ball.remove(index);
      
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (
      boats[boats.length - 1] === undefined ||
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, 120, -70, -20];
      var position = random(positions);
      var boat = new Boat(width, height - 200, 100, 170, position);

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });

        boats[i].display();
      } 
    }
  } else {
    var boat = new Boat(width, height - 200, 170, 170, -60);
    boats.push(boat);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}
function collisionWithBoat(index) { 
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) { 

      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);


      if(collision.collided){
        boats[i].remove(i);
        Matter.World.remove(world,balls[index].body);
        delete balls[index];

      }
    }
}
}

function mute() {
  if(backgroundMusic.isPlaying())
{
backgroundMusic.stop();
 }

else{backgroundMusic.play();
 } 
}
