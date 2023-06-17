//id // Create the canvas
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
heroImage.src = "images/spriteSheetProp.png";

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


/////////////ANIMATIONS////////////
// 4 rows and 3 cols in my space ship sprite sheet
var rows = 4;
var cols = 3;


var trackUp = 0;
var trackDown = 3;
var trackRight = 1;
//second row for the left movement (counting the index from 0)
var trackLeft = 2;


var spriteWidth = 110; // also  spriteWidth/cols; 
var spriteHeight = 142;  // also spriteHeight/rows; 
var width = spriteWidth / cols; 
var height = spriteHeight / rows;

var curXFrame = 0; // start on left side
var frameCount = 3;  // 3 frames per row
//x and y coordinates of the overall sprite image to get the single frame  we want
var srcX = 0;  // our image has no borders or other stuff
var srcY = 0;

//Assuming that at start the character will move up 
var left = false;
var right = false;
var up = true;
var down = false;


var counter = 0
//////////////ANIMATIONS/////////////


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
    // if (38 in keysDown && hero.y > 32 + 4) { //  holding up key
    //     hero.y -= hero.speed * modifier;
    // }
    // if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { //  holding down key
    //     hero.y += hero.speed * modifier;
    // }
    // if (37 in keysDown && hero.x > (32 + 4)) { // holding left key
    //     hero.x -= hero.speed * modifier;
    // }
    // if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // holding right key
    //     hero.x += hero.speed * modifier;
    // }

    // clear last hero image posistion  and assume he is not moving left or rigth
    //ctx.clearRect(hero.x, hero.y, width, height);
    left = false;
    right = false;
    up = false;
    down = false;

    //then decide if they are moving left or right and set those
    if (37 in keysDown && hero.x > (32 + 4)) { // holding left key
            hero.x -= hero.speed * modifier;
            left = true;   // for animation
        }
        //if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // holding right key
    if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // holding right key
            hero.x += hero.speed * modifier;left = false;   // for animation
            right = true; // for animation
        }
    if (38 in keysDown && hero.y > 32 + 4) { //  holding up key
            hero.y -= hero.speed * modifier;
            up = true;   // for animation
        }
    if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { //  holding down key
            hero.y += hero.speed * modifier;
            down = true; // for animation
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

    if (counter == 6) {  // adjust this to change "walking speed" of animation
        curXFrame = ++curXFrame % frameCount; 	//Updating the sprite frame index 
        // it will count 0,1,2,0,1,2,0, etc
        counter = 0;
    } else {
        counter++;
    }

    srcX = curXFrame * width;   	//Calculating the x coordinate for spritesheet 
    //if left is true,  pick Y dim of the correct row
    if (left) {
        //calculate srcY 
        srcY = trackLeft * height;
    }

    //if the right is true,   pick Y dim of the correct row
    if (right) {
        //calculating y coordinate for spritesheet
        srcY = trackRight * height;
    }
        //if the right is true,   pick Y dim of the correct row
    if (up) {
        //calculating y coordinate for spritesheet
        srcY = trackUp * width;
    }
    if (down) {
        //calculating y coordinate for spritesheet
        srcY = trackDown * width;
    }

    if (left == false && right == false && up == false && down == false) {
        srcX = 0 * width;
        srcY = 0 * height;
    }


    if(monstersCaught === 5) {
        // change sound effect and play it.
        soundEfx.src = soundWon;
        soundEfx.play();
    }

    // Update projectile position
    if (projectile) {
        projectile.y -= projectile.speed * modifier;

        // Check if projectile hits the monster
        if (
            projectile.x <= (monster.x + 32) &&
            monster.x <= (projectile.x + 32) &&
            projectile.y <= (monster.y + 32) &&
            monster.y <= (projectile.y + 32)
        ) {
            soundEfx.src = soundHit;
            soundEfx.play();
            ++monstersCaught; // Increase the score
            resetMonster(); // Reset monster position
            projectile = null; // Remove the projectile
        }

        // Check if projectile goes off-screen
        if (projectile.y < 0) {
            projectile = null; // Remove the projectile
        }
    }

    if (projectile) {
        projectile.y -= projectile.speed * modifier;

        if (projectile.y < 0) {
            projectile = null;
        }
    }

    if (monstersCaught === 5) {
        // change sound effect and play it.
        soundEfx.src = soundWon;
        soundEfx.play();
        resetGame(); // Reset the game if the score reaches 5
    }
    
};

var resetGame = function () {
    monstersCaught = 0;
    reset();
};






// Draw everything in the main render function
var render = function () {
    if (bgReady) {

        ctx.drawImage(bgImage, 0, 0);
    }
    // if (heroReady) {
    //     ctx.drawImage(heroImage, hero.x, hero.y);
    // }
    if (heroReady) {
        //ctx.drawImage(heroImage, hero.x, hero.y);
         ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
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


