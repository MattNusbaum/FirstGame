// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);
let gameover = false;
let won = false;


let chessBoard = [
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
];

// load images ========================================================
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background2.png";

// side images
let sidesReady = false;
let sidesImage = new Image();
sidesImage.onload = function () {
    sidesReady = true;
};
sidesImage.src = "images/sides.jpg";

// top images
let topReady = false;
let topImage = new Image();
topImage.onload = function () {
    topReady = true;
};
topImage.src = "images/top.jpg";

//Projectile image
var projectileReady = false;
var projectileImage = new Image();
projectileImage.onload = function () {
    projectileReady = true;
};
projectileImage.src = "images/projectile.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/ship.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/asteroid.png";

// done with load images ========================================================



// load sound objects ===================================================
let soundGameOver = "sounds/gameover.wav";
let soundWon = "sounds/gamewon.wav";
let soundShot = "sounds/shot.wav";
let soundHit = "sounds/hit.wav";
let soundEfx = document.getElementById("soundEfx");




// define objects and variables we need =========================================

// Game objects
var hero = {
    speed: 456, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};

//Projectile object
var projectile = null;

var monster = {
    // for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};
var monstersCaught = 0;

// end define objects and variables we need =========================================

// keyboard control =============================================
// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {

    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {

    delete keysDown[e.keyCode];
}, false);

addEventListener("keydown", function (e) {
    if (e.keyCode === 32) { // Space key
        shootProjectile();
    }
}, false);

// end keyboard control =============================================



function shootProjectile() {
    if (!projectile) {
        projectile = {
            x: hero.x + 16, // Adjust the position as per your requirements
            y: hero.y + 16, // Adjust the position as per your requirements
            speed: 600, // Adjust the speed as per your requirements
        };
    }
}


// define functions ==============================================



// Update game objects
var update = function (modifier) {

    //  adjust based on keys
    if (38 in keysDown && hero.y > 32 + 4) { //  holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { //  holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (32 + 4)) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // holding right key
        hero.x += hero.speed * modifier;
    }

   

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) { soundEfx.src = soundShot;
        soundEfx.play();
        ++monstersCaught;       // keep track of our “score”
        reset();       // start a new cycle
    }
    if(monstersCaught === 5) {
        // change sound effect and play it.
        soundEfx.src = soundWon;
        soundEfx.play();
    }

    if (projectile) {
        projectile.y -= projectile.speed * modifier;

        if (projectile.y < 0) {
            projectile = null;
        }
    }
};



// Draw everything in the main render function
var render = function () {
    if (bgReady) {

        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    if (projectile && projectileReady) {
        ctx.drawImage(projectileImage, projectile.x, projectile.y);
    }
    if (sidesReady) {
        ctx.drawImage(sidesImage, 0, 0);
        ctx.drawImage(sidesImage, 0, 966);
    }
    if (topReady) {
        ctx.drawImage(topImage, 0, 0);
        ctx.drawImage(topImage, 966, 0);
    }
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Asteroids Destroyed: " + monstersCaught, 32, 32);

}



// Reset the game when the player catches a monster
var reset = function () {
    placeItem(hero);
    placeItem(monster);
};


let placeItem = function (character)
{
    let X = 5;
    let Y = 6;
    let success = false;
    while(!success) {
        X = Math.floor( Math.random( ) * 9 );

        Y = Math.floor( Math.random( ) * 9 );

        if( chessBoard[X][Y] === 'x' ) {
            success = true;
        }
    }
    chessBoard[X][Y] = 'O';
    character.x = (X*100) + 32;
    character.y = (Y*100) + 32;
}



// The main game loop
let main = function () {

    if(gameover == false){
    let now = Date.now();
    let delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    //  Request to do this again ASAP
    requestAnimationFrame(main);
    }
    else {
        if(won == true){
            alert("You Won!")
        }
    }
};


// end of define functions ==============================================




// Let's play this game!  ===============
var then = Date.now();
reset();
main();  // call the main game loop.


