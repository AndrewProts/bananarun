var game = new Phaser.Game(800, 440, Phaser.CANVAS, 'body', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.image('bananaTree', 'img/banana_tree.png');
  game.load.image('ground', 'img/ground.png');
  game.load.image('banana', 'img/banana.png');
  game.load.image('monkey', 'img/monkey.png');
  game.load.image('monkey2', 'img/monkey2.png');
}

var bananaTree;
var ground;
var banana;
var score = 0;
var monkeyPos = 1000;
var gameOptions = {
  start: false,
  scrollSpeed: 0,
  complexity: 1,
  monkey: false
}

function create() {
  game.stage.backgroundColor = '#87CEEB';

  game.physics.startSystem(Phaser.Physics.ARCADE);

  ground = game.add.tileSprite(0,320,800,120,'ground')
  bananaTree = game.add.tileSprite(280,-20,247,400,'bananaTree')

  monkey = game.add.sprite(monkeyPos,300,'monkey')
  monkey.scale.set(0.4,0.4)
  monkey.scale.x*=-1
  monkey.anchor.setTo(0.5,0.5)
  game.physics.enable(monkey, Phaser.Physics.ARCADE);
  monkey.body.setSize(300,500,-10)

  monkey2 = game.add.sprite(monkeyPos,0,'monkey2')
  monkey2.anchor.setTo(0.5,0)
  monkey2.scale.set(0.13,0.13)
  game.physics.enable(monkey2, Phaser.Physics.ARCADE);

  //hero
  banana = game.add.sprite(420,340,'banana')
  banana.anchor.setTo(0.5,0.5)
  banana.scale.set(0.15,0.15)
  game.physics.enable(banana, Phaser.Physics.ARCADE);

  scoreText = game.add.text(10, 10, 'score: ' + score, { font: '24px Arial', fill: '#fff' });
  beginText = game.add.text(530, 100, 'To begin press Space', { font: '24px Arial', fill: '#fff' });
  gameOver = game.add.text(game.world.centerX, 100, 'Game Over', { font: '34px Arial', fill: '#fff', boundsAlignH: "center", boundsAlignV: "middle"});
  gameOverText = game.add.text(game.world.centerX, 200, 'Press Space to restart', { font: '34px Arial', fill: '#fff', boundsAlignH: "center", boundsAlignV: "middle"});
  gameOverText.anchor.setTo(0.5,1)
  gameOver.anchor.setTo(0.5,1)
  gameOver.visible = false;
  gameOverText.visible = false;

  cursors = game.input.keyboard.createCursorKeys();
  startGame = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  ground.tilePosition.x-=gameOptions.scrollSpeed*(gameOptions.complexity);
  bananaTree.position.x-=gameOptions.scrollSpeed;

  if(monkey.position.x<-100){
    monkey.position.x=monkeyPos
    monkey.body.velocity.x=0
    gameOptions.monkey = true;
  }
  if(monkey2.position.x<-100){
    monkey2.position.x=monkeyPos
    monkey2.body.velocity.x=0
    gameOptions.monkey = true;
  }
  if(score>=2000){
    gameOptions.complexity=2;
  }
  if(score>=5000){
    gameOptions.complexity=3;
  }
  if(score>=8000){
    gameOptions.complexity=4;
  }
  if(score>=10000){
    gameOptions.complexity=5;
  }
  if(score>=12000){
    gameOptions.complexity=6;
  }
  if(score>=15000){
    gameOptions.complexity=7;
  }

  game.physics.arcade.overlap(monkey, banana, collisionCallback, null, this);
  game.physics.arcade.overlap(monkey2, banana, collisionCallback, null, this);

  if(gameOptions.start){
    runMonkey();
    score+=gameOptions.scrollSpeed;
    scoreText.text = 'score: ' + score;

    banana.body.velocity.setTo(0, 0);
    if (cursors.up.isDown)
    {
        banana.body.velocity.y = -300;
    }else if (cursors.down.isDown)
    {
        banana.body.velocity.y = 300;
    }
    if(banana.position.y<=50){
      banana.position.y=50
    }
    if(banana.position.y>=320){
      banana.position.y=320
    }
    banana.position.x-=1;
    if(banana.position.x<200){
      banana.position.x = 200
    }
  }

  if(startGame.isDown){
    beginGame();
  }

}

function runMonkey() {
    if(gameOptions.monkey){
      if(Math.random()>0.5){
        monkey.body.velocity.x-=gameOptions.scrollSpeed*(gameOptions.complexity*100);
      }else{
        monkey2.body.velocity.x-=gameOptions.scrollSpeed*(gameOptions.complexity*100);
      }
      gameOptions.monkey=false;
    }
}

function collisionCallback() {
  banana.kill();
  endGame();
}

function beginGame() {
  if(!gameOptions.start){
    bananaTree.position.x = 280;
    gameOver.visible = false;
    gameOverText.visible = false;
    gameOptions.start = true;
    gameOptions.scrollSpeed = 2;
    gameOptions.complexity = 1;
    gameOptions.monkey = true;
    beginText.visible = false;
    banana.revive();
    banana.position.x = 420;
    banana.position.y = 340;
    score = 0;
    monkey.position.x = monkeyPos;
    monkey2.position.x = monkeyPos;
    monkey.body.velocity.x = 0;
    monkey2.body.velocity.x = 0;
  }
}

function endGame() {
  gameOptions.start = false;
  gameOver.visible = true;
  gameOverText.visible = true;
}

function render() {
  // game.debug.body(monkey);
  // game.debug.body(monkey2);
  // game.debug.body(banana);
}
