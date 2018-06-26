'use strict'


// Enemies our player must avoid
var Enemy = function() {
  // instance variables:
  this.sprite = 'images/enemy-bug.png';
  this.x = Math.round(Math.random() * 4) + 1;
  this.y = Math.round(Math.random() * 5) + 1;
  this.speed = Math.round(Math.random() * 2.5) + 1;
};
/* shared prototype methods: */
// Move Enemy
Enemy.prototype.update = function(dt) {
  // dt parameter ensures the game runs at the same speed for
  // all computers.
  //If we've gone beyond canvas:
  this.x += (this.speed * dt);
  if (this.x > 5) {
    this.x = -1;
    this.y = Math.round((Math.random() * 5) + 1);
  };

  // Collision detection:
  if (Math.round(this.x) === player.x &&
    this.y === player.y) {
    // You died.
    player.x = 2;
    player.y = 6;

    gameTime = 0;
    gemSet = new GemSet();
  }
};
// (re)Draw the enemy
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x * 100, this.y * 83);
}

// Player Class
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 0;
  this.y = 0;
};

// Player.prototype = Object.create(Enemy.prototype);
// Player.prototype.constructor = Player;
Player.prototype.render = Enemy.prototype.render;
Player.prototype.update = function() {
  this.render();
}
Player.prototype.handleInput = function(key) {
  console.log(key);
  if (key === 'left') {
    this.x--;
  };
  if (key === 'up') {
    this.y--;
  };
  if (key === 'right') {
    this.x++;
  };
  if (key === 'down') {
    this.y++;
  };
};

var Gem = function(id) {
  this.sprite = 'images/Star.png';
  this.id = id;
  this.x = Math.round(Math.random() * 4) + 1;
  this.y = Math.round(Math.random() * 5) + 1;
}

Gem.prototype.render = Enemy.prototype.render;

var GemSet = function() {
  this.lastGem = 0;
  this.gems = { 1: null, 2: null, 3: null };
  this.gemCount = 0;
}


GemSet.prototype.update = function() {
  if (gameTime - this.lastGem > 2 &&
    this.gemCount < 3) {
    this.gems[this.gemCount + 1] = new Gem();
    ++this.gemCount;
    this.lastGem = gameTime;
  }
};

GemSet.prototype.render = function() {
  for (var gemKey in this.gems) {
    var gem = this.gems[gemKey];
    if (gem != null) {
      if (player.x === gem.x && player.y === gem.y) {
        this.gems[gemKey] = null;
        --this.gemCount;
      }
      else {
        gem.render();
      }
    }

  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
var gemSet = new GemSet();

var allEnemies = [
  new Enemy(),
  new Enemy(),
  new Enemy()
];

var timeDOM = document.getElementById("time");
function renderTime() {
  var timeDOM = document.getElementById("time");
  timeDOM.innerText = `Time: ${Math.round(gameTime)}`;
};


//player.render();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

var render = function(obj) {
  ctx.drawImage(Resources.get(obj.sprite), obj.x * 100, obj.y * 83);
}

