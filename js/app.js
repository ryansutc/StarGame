'use strict';

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
  }

  // Collision detection:
  if (Math.round(this.x) === player.x &&
    this.y === player.y) {
    // You died.
    resetGame();
  }
};
// (re)Draw the enemy
Enemy.prototype.render = function() {
  //Player, Gem use this method also.
  ctx.drawImage(Resources.get(this.sprite), this.x * 100, this.y * 83);
};

var SmartEnemy = function() {
  Enemy.call(this);
  this.sprite = 'images/Rock.png';
  this.x = 0;
  this.speed = 1;
  this.fire = false;
};
SmartEnemy.prototype = Object.create(Enemy.prototype);
SmartEnemy.prototype.constructor = SmartEnemy;
SmartEnemy.prototype.update = function(dt) {
  //Move to first tile, then stop:
  if (this.x < 0 || this.fire === true) {
    this.x += (this.speed * dt);
  }
  //If Player steps in line, fire:
  if (player.y === this.y) {
    this.fire = true;
  }
  //If we've gone beyond canvas:
  if (this.x > 5) {
    this.x = -1;
    this.y = Math.round((Math.random() * 5) + 1);
    this.fire = false;
  }

  // Collision detection:
  if (Math.round(this.x) === player.x &&
    this.y === player.y) {
    // You died.
    resetGame();
  }
};

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
};
Player.prototype.handleInput = function(key) {
  console.log(key);
  if (key === 'left') {
    this.x--;
  }
  if (key === 'up') {
    this.y--;
  }
  if (key === 'right') {
    this.x++;
  }
  if (key === 'down') {
    this.y++;
  }
};

var Gem = function(id) {
  this.sprite = 'images/Star.png';
  this.id = id;
  this.x = Math.round(Math.random() * 4) + 1;
  this.y = Math.round(Math.random() * 5) + 1;
};

Gem.prototype.render = Enemy.prototype.render;

var GemSet = function() {
  this.lastGem = 0;
  this.gems = { 1: null, 2: null, 3: null };
  this.gemCount = 0;
};


GemSet.prototype.update = function() {
  if (gameTime - this.lastGem > 2 &&
    this.gemCount < 3) {
    for (var gemKey in this.gems) {
      var gem = this.gems[gemKey];
      if (gem === null) {
        this.gems[gemKey] = new Gem();
        ++this.gemCount;
        this.lastGem = gameTime;
        return;
      }
    }
  }
};

GemSet.prototype.render = function() {
  for (var gemKey in this.gems) {
    if (this.gems.hasOwnProperty(gemKey)) {
      var gem = this.gems[gemKey];
      if (gem !== null) {
        if (player.x === gem.x && player.y === gem.y) {
          this.gems[gemKey] = null;
          --this.gemCount;
          renderPoints();
        }
        else {
          gem.render();
        }
      }
    }
  }
};

var player = new Player();
var gemSet = new GemSet();

var allEnemies = [
  new Enemy(),
  new Enemy(),
  new Enemy(),
];


var timeDOM = document.getElementById("time");
var pointsDOM = document.getElementById("points");

//used in engine.js
function renderTime() {
  timeDOM.innerText = "Time: " + Math.round(gameTime);
  if (gameTime / allEnemies.length > 5) {
    allEnemies.push(new SmartEnemy());
  }
}

function renderPoints() {
  pointsDOM.innerText = "Points: " + addPoint();
}

function resetGame() {
  player.x = 0;
  player.y = 0;

  gameTime = 0;
  gemSet = new GemSet();
  pointsDOM.innerText = "Points:  0";
  while (allEnemies.length > 3) {
    allEnemies.pop();
  }
}


var addPoint = (function() {
  // A way to add points using callbacks
  var points = 0;
  return function() {
    points += 1;
    return points;
  };
})();


// This listens for key presses and sends the keys to 
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});