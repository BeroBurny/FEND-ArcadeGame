// Enemies Class (our player must avoid)
class Enemy {
	constructor(row = getRandomInt(4), side = getRandomInt(2), speed = getRandomInt(100)) {
		// Limit only to 2 bugs per row
		while(game.enemyRows[row] >= 2) {
			row = getRandomInt(4);
		}

		this.y = (row * 83) + 62; // row 62 + row * 83
		this.leftSpawn = side === 1? true: false;
		this.leftSpawn ? this.x = -90: this.x = 500;
		this.speed = 100 + speed;

		this.row = row;
		game.enemyRows[row]++;
		// The image/sprite for our enemies, based on enemy orijentation
		this.sprite = this.leftSpawn ? 'images/enemy-bug.png': 'images/enemy-bug-left.png';
	}

	// Update the enemy's position, required method for game
	// Parameter: dt, a time delta between ticks
	update(dt) {
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		if (this.leftSpawn) {
			if(this.x < 500)
				this.x += this.speed * dt;
			else {
				game.enemyRows[this.row]--;
				allEnemies.splice(allEnemies.indexOf(this), 1);
			}
		} else {
			if(this.x > -100)
				this.x -= this.speed * dt;
			else {
				game.enemyRows[this.row]--;
				allEnemies.splice(allEnemies.indexOf(this), 1);
			}
		}
		game.checkPlayerColision(this.x, this.y);
	}
	// Draw the enemy on the screen, required method for game
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

// Player Class
class Player {
	// Player constructor
	constructor() {
		this.ready = false;
		this.alive = true;
		this.x = 202;
		this.y = 380;
		this.sprite = 'images/char-boy.png';
		console.log("Player Created");
	}

	update() {

	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	handleInput(key) {
		if (key != undefined ) {
			if(this.alive) {
				if(key === "up" && this.y > 0 && this.ready) this.y -= 83;
				else if (key === "down" && this.y < 380) this.y += 83;
				else if (key === "left" && this.x > 0) this.x -= 101;
				else if (key === "right" && this.x < 400) this.x += 101;

				if(!this.ready && key === "space") this.ready = true;
			} else {
				if(key === "space" && !game.gameOver) player.respawn();
				else if(key === "space" && game.gameOver) game.restartGame();
			}
		}
	}

	respawn() {
		this.x = 202;
		this.y = 380;
		this.alive = true;
		// allEnemies = [];
		// game.enemyRows = [0, 0, 0, 0];
	}
}

// Game class
class Game {
	constructor() {
		this.enemyRows = [0, 0, 0, 0];
		this.gameOver = false;
		this.life = 3;
		this.level = 1;
		this.score = 0;
		this.delay = 0;
	}

	update(dt) {
		const enemys = allEnemies.length;
		if(this.delay >= 100){
			if(player.ready && enemys < (3 + this.level)) allEnemies.push(new Enemy());
			else if (!player.ready  && enemys < 3) allEnemies.push(new Enemy(getRandomInt(3)));
			this.delay -= 100;
		}
		this.delay += dt * 200;

	}

	render() {
		ctx.font = "25px Arial";
		ctx.fillText("Life:",20,45);
		ctx.fillText("Level: " + this.level,200,45);
		ctx.fillText("Score: " + this.score,375,45);

		if(this.life >= 1) ctx.drawImage(Resources.get("images/Heart.png"), 70, 10, 30,47);
		if(this.life >= 2) ctx.drawImage(Resources.get("images/Heart.png"), 100, 10, 30,47);
		if(this.life === 3) ctx.drawImage(Resources.get("images/Heart.png"), 130, 10, 30,47);
		if(this.life > 3) this.life = 0;
	}

	renderOver() {
		ctx.font = "45px Arial";

		// white text for background
		ctx.fillStyle = "white";
		// show how to start game
		ctx.fillText("Press \"space\" to restart!",15,520);

		// text color to black
		ctx.fillStyle = "black";
		// game ower
		ctx.fillText("GAME OWER",115,110);
		// show how to start game stroke
		ctx.strokeText("Press \"space\" to restart!",15,520);
	}

	renderHit() {
		ctx.font = "45px Arial";
		// white text for background
		ctx.fillStyle = "white";
		// collect info
		ctx.fillText("You lost one!",90,130);
		// show how to start game
		ctx.fillText("Press \"space\" to retry!",40,520);

		// red text for background
		ctx.fillStyle = "red";
		// info about enemy
		ctx.fillText("Something hit you!",65,85);

		// text stroke color
		ctx.fillStyle = "black";
		// collect info stroke
		ctx.strokeText("Something hit you!",65,85);
		// collect info stroke
		ctx.strokeText("You lost one!",90,130);
		// show how to start game stroke
		ctx.strokeText("Press \"space\" to retry!",40,520);
		ctx.drawImage(Resources.get("images/Heart.png"), 360, 70, 50,79);
	}

	renderMenu() {
		// set text overlay
		ctx.font = "45px Arial";
		// drawn game tutorial
		// white text for background
		ctx.fillStyle = "white";
		// collect info
		ctx.fillText("Collect:",40,110);
		// to get (key)
		ctx.fillText("To get",40,190);
		// for end (pickup)
		ctx.fillText("for end",250,190);
		// and get new (character)
		ctx.fillText("and get new ",100,270);
		// But carefully!
		ctx.fillText("Move with arow keys.",40,350);
		// show how to start game
		ctx.fillText("Press \"space\" to start!",40,520);

		// red text for background
		ctx.fillStyle = "red";
		// info about enemy
		ctx.fillText("Don't get hit by",40,440);

		// text stroke color
		ctx.fillStyle = "black";
		// collect info stroke
		ctx.strokeText("Collect:",40,110);
		// to get (key) stroke
		ctx.strokeText("To get",40,190);
		// for end (pickup) stroke
		ctx.strokeText("for end",250,190);
		// and get new (character) stroke
		ctx.strokeText("and get new ",100,270);
		// But carefully! stroke
		ctx.strokeText("Move with arow keys.",40,350);
		// info about enemy stroke
		ctx.strokeText("Don't get hit by",40,440);
		// show how to start game stroke
		ctx.strokeText("Press \"space\" to start!",40,520);

		// spawn images on needed positions
		// bug image
		ctx.drawImage(Resources.get("images/enemy-bug.png"), 355, 311);
		// colectable
		ctx.drawImage(Resources.get("images/Gem Green.png"), 202, -30);
		ctx.drawImage(Resources.get("images/Gem Orange.png"), 303, -30);
		ctx.drawImage(Resources.get("images/Gem Blue.png"), 404, -30);
		// key
		ctx.drawImage(Resources.get("images/Key.png"), 155, 60);
		// end game pickup
		ctx.drawImage(Resources.get("images/Star.png"), 404, 60);
		// character
		ctx.drawImage(Resources.get("images/char-cat-girl.png"), 339, 143);
	}

	restartGame() {
		this.gameOver = false;
		player.respawn();
		this.life = 3;
		this.level = 1;
		this.score = 0;
		player.ready = false;
	}

	checkPlayerColision(x, y) {
		if(player.y === y - 14) {
			const plx = player.x + 25;
			if ((x <= plx && plx <= (x + 100)) || (x <= (plx + 50) && (plx + 50) <= (x + 100))) { //
				if(this.life === 0) this.gameOver = true;
				else this.life--;
				player.alive = false;
			}
		}
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var player = new Player();
var game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
	var allowedKeys = {
		32: 'space',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

// Generate random Integer
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
	return Math.floor(Math.random(new Date().getTime()) * Math.floor(max));
}
