var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var GAME_SCALE = 4;

var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ GAME_WIDTH, GAME_HEIGHT, backgroundColor: 0x6ac48a });

gameport.appendChild( renderer.view );

/*
Different containers for different menus
*/
var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;


var titleScreen = new PIXI.Container();
/*
titleScreen.scale.x = GAME_SCALE/4;
titleScreen.scale.y = GAME_SCALE/4;
*/ 

var gameScreen = new PIXI.Container();
/* 
gameScreen.scale.x = GAME_SCALE/4;
gameScreen.scale.y = GAME_SCALE/4;
*/ 

var creditsScreen = new PIXI.Container();
/*
creditsScreen.scale.x = GAME_SCALE/4; 
creditsScreen.scale.Y = GAME_SCALE/4;
*/ 

var tutorialScreen = new PIXI.Container();
/*
tutorialScreen.scale.x = 0.25; 
tutorialScreen.scale.Y = 0.25; 
 */ 

var world = new PIXI.Container(); 
world.scale.x = 0.25; 
world.scale.y = 0.25; 

// Add the title screen to the stage first, so it'll be the first thing present
stage.addChild( titleScreen );

// Load all of the items we will need for the game 
PIXI.loader
  .add( 'tilemap_json', 'tile_assets/tilemap.json' )
  .add( 'player_character',     'player_character.png' )
	.add( 'tileSet', 'tile_assets/tileset_2.png' )
  .load( loadWorld );

/*
* Create menu buttons
*/
// Create start button
var startButton = new PIXI.Sprite( PIXI.Texture.fromImage( "startButton.png" ));
startButton.interactive = true;
startButton.on( 'mousedown', startButtonClickHandler );
startButton.position.x = 400/4;
startButton.position.y = 300/4;
startButton.scale.x = GAME_SCALE/20;
startButton.scale.y = GAME_SCALE/20;
startButton.anchor.x = 0.5;
startButton.anchor.y = 0.5;

// Create tutorial button
var tutorialButton = new PIXI.Sprite( PIXI.Texture.fromImage( "tutorialButton.png" ));
tutorialButton.interactive = true;
tutorialButton.on( 'mousedown', tutorialButtonClickHandler );
tutorialButton.position.x = 500/4;
tutorialButton.position.y = 500/5;
tutorialButton.scale.x = GAME_SCALE/20;
tutorialButton.scale.y = GAME_SCALE/20;
tutorialButton.anchor.x = 0.5;
tutorialButton.anchor.y = 0.5;

// create credits button
var creditsButton = new PIXI.Sprite( PIXI.Texture.fromImage( "creditsButton.png" ));
creditsButton.interactive = true;
creditsButton.on( 'mousedown', creditsButtonClickHandler );
creditsButton.position.x = 300/4;
creditsButton.position.y = 500/5;
creditsButton.scale.x = GAME_SCALE/20;
creditsButton.scale.y = GAME_SCALE/20;
creditsButton.anchor.x = 0.5;
creditsButton.anchor.y = 0.5;

// create back button
var backButton = new PIXI.Sprite( PIXI.Texture.fromImage( "backButton.png" ));
backButton.interactive = true;
backButton.scale.x = GAME_SCALE/20;
backButton.scale.y = GAME_SCALE/20;
backButton.on( 'mousedown', backButtonClickHandler );

// Set constant values for our game 
// Constant values for character movement 
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// Constant values for tile-based collision 
const FLAT_GROUND = 15; 
const RIGHT_SLOPE = 12; 
const LEFT_SLOPE = 18; 
const BEDROCK = 14; 

// Object that will hold the tileMaps for different levels 
let tileMap = 
	{
	width: 16, 
	height: 16, 
	
	// TileMap for the main game 
	tiles: 
		[
		
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
		1, 2, 4, 5, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 1, 1, 
		1, 8, 10, 11, 1, 1, 1, 1, 1, 1, 1, 8, 9, 10, 1, 1, 
		1, 1, 1, 17, 17, 17, 17, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
		1, 1, 1, 15, 15, 15, 15, 12, 1, 1, 1, 1, 1, 1, 1, 1, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
		17, 17, 17, 1, 1, 1, 1, 1, 17, 17, 1, 1, 1, 1, 1, 1, 
		15, 15, 15, 12, 1, 1, 1, 18, 15, 15, 17, 17, 17, 1, 1, 1, 
		14, 14, 14, 14, 1, 1, 18, 14, 14, 14, 15, 15, 15, 1, 1, 1, 
		13, 13, 13, 13, 1, 1, 13, 13, 13, 13, 14, 14, 14, 1, 1, 1, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 14, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 14, 13, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 14, 13, 13, 
		1, 1, 17, 17, 17, 17, 18, 12, 17, 17, 17, 18, 14, 13, 13, 13, 
		1, 18, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 13, 13, 13
		], 
		
	// TileMap for the tutorial level 
	tutorialTiles: 
		[
		15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15 
		]
	}	
	
// Our tile set that contains all of our building block tiles
var tileSet = []; 

// Object that represents the player and the values for movement 
var player;
player = {//player's metadata
		x: 200,
		y: 100,
		speed: 3,
		xVel: 0,
		yVel: 0,
		onGround: false,
		isJumping: false
	};

// The sprite for the player character 
var playerVis = new PIXI.Sprite(PIXI.Texture.from( "player_character.png" ));
	playerVis.x = player.x;
	playerVis.y = player.y;

// Making sure that player movement and control are not available outside of main game 
var gameRunning = false;

// Ensuring that our scaling is correct 
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// Function that executes when loading our assets 
function loadWorld()
{
	
	// Variables 
	// Creating a short cut to the resources we've loaded 
	let resources = PIXI.loader.resources;
	
	// Constants for creating the tileMap and tileSet 
	const tileSetWidth = 6;
  const tileSetHeight = 3;
  const tileSize = 34;

	// Manually cut up our sprite sheet to create each of our tiles 
  for( let i = 0; i < tileSetWidth * tileSetHeight; i++ )
    {
			
		// Save the x "index" for the x position of our tile on the sprite sheet 
    let x = i % tileSetWidth;
		
		// Save the y "idnex" for the y position of our tiles on the sprite sheet 
    let y = Math.floor( i / tileSetWidth );

		// Cut out the piece of the sprite sheet that we want and save it to our tileset array 
    tileSet[ i ] = new PIXI.Texture(
		
			// Retreive the entire sprite sheet 
      resources.tileSet.texture,
			
			// Cut out the specific tile we want during this iteration of the loop 
			// Add 1 to account for the margin on the outside border of the sprite sheet 
      new PIXI.Rectangle( x * tileSize + 1, y * tileSize + 1, tileSize, tileSize )
      );
    }
		
	// Create a separate container for our tileMap to be drawn on 
	var background = new PIXI.Container(); 
	
	// Loop through the y axis of our background tiles 
	for( let y = 0; y < tileMap.width; y++ )
		{
			
		// Loop through the x axis of our background tiles
		for( let x = 0; x < tileMap.height; x++ )
			{

			// Save the position of the tile that we want to place 
			let tile = tileMap.tiles[ y * tileMap.width + x]; 
			
			// Save and draw the tile that we are going to place 
			let sprite = new PIXI.Sprite( tileSet[ tile - 1 ]); 
			
			// Set the position and anchor of the tile 
			sprite.anchor.x = 0.0; 
			sprite.anchor.y = 0.0; 
			sprite.x = x * ( tileSize ); 
			sprite.y = y * ( tileSize ); 
			
			// Add the drawn tile to our background container 
			background.addChild( sprite ); 
			}		
		}

  // Add the background to our playable world 
	world.addChild( background ); 

	// Ensure that when the player spawns, they are not moving 
  player.direction = MOVE_NONE;
  player.moving = false;
}

/*
* Desc: Event handler that looks out for player movement input 
*/ 
function keydownHandler(key) {
    //w
		// Check if the player hits the w key and they are on the ground 
    if( key.keyCode == 87 && playerOnGround( player.x, player.y )) {
			player.yVel = -2;
      player.isJumping = true;
    }

    //a
    if(key.keyCode == 65) {
		player.moveRight = true;
    }

    //d
    if(key.keyCode == 68) {
		player.moveLeft = true;
    }
}

/*
* Check if the player has let go of the horizontal movement keys 
*/ 
function keyupHandler(key) {
    //a
    if(key.keyCode == 65) {
		player.moveRight = false;
    }

    //d
    if(key.keyCode == 68) {
		player.moveLeft = false;
    }
}

// Add the event listener for player movement input 
document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);

/*
* Desc: Performs the logic necessary for the player to move
*/ 
function moveCharacter()
{
	
	// Save the position that the player will be at momentarily 
	var newPosX = player.x + (player.speed * player.xVel);
	var newPosY = player.y + (player.speed * player.yVel);
	
	// Check if the player is currently going upward
	// This is to ensure that the player can jump while on the ground 
	// When the jump key is pressed, player.yVel is negative, so jumping stays true 
	if( player.yVel > 0 )
		{
			
		player.isJumping = false; 
		}

	// Check if the player is on the ground and they are not jumping
	// If the player has just jumped, then the playerOnGround function will not keep 
	// the player grounded 
	if( playerOnGround( player.x, player.y ) && player.isJumping == false  )
		{
			
		player.yVel = 0; 
		}
	
	// If the player is not on the ground or is jumping
	else
		{
		player.yVel += .05;
		}
		
	// Add whatever vertical velocity the player is experiencing to their position 
	player.y += player.speed * player.yVel;

	// Check if the player is moving left or right, but also handle side collisions 
	if( player.moveLeft == true && !leftBlocked)
	{
		player.x += 1.5;
	}

	if( player.moveRight == true && !rightBlocked)
	{
		player.x -= 1.5;
	}

	// Ensure that the anchor of the sprite is at its feet 
	playerVis.x = player.x - 15;
	playerVis.y = player.y - 45;

}


function animate(timestamp)
{
	requestAnimationFrame(animate);
	if(gameRunning)
	{
		moveCharacter();
	}
	renderer.render(stage);
 }

function GameLoop()
{
	requestAnimationFrame(GameLoop);
	//update_camera();
}

initializeTitleScreen();
animate();


/*
* Desc: Initializes the opening title screen for the game
*/
function initializeTitleScreen()
	{

  // Add the buttons for title menu functionality
	titleScreen.addChild( startButton );
  titleScreen.addChild( tutorialButton );
  titleScreen.addChild( creditsButton );

  // Create the text that will appear on the start menu
	var titleText = new PIXI.Text( "Simple Platformer" );
	titleText.position.x = 400/4;
	titleText.position.y = 200/4;
	titleText.scale.x = GAME_SCALE/20;
	titleText.scale.y = GAME_SCALE/20;
	titleText.anchor.x = 0.5;
	titleText.anchor.y = 0.5;

  // Add the text to the screen
	titleScreen.addChild( titleText );
	}

/*
* menu button click handler functions
*/
/*
* Desc: Handles the event when the player clicks on the start button on the
*   main menu. Begins the game proper.
*/
function startButtonClickHandler( e )
	{

  // Remove the title screen from the stage
	stage.removeChild( titleScreen );
  // Add the container that holds the main game to the stage

	GameLoop();
	
	// Add the containers necessary for gameplay to the stage 
	stage.addChild( gameScreen );
	stage.addChild( world );
	
	// Add the player sprite to the world 
	world.addChild( playerVis );
	
	// Ensure that the program knows that the game has started 
	gameRunning = true;

	renderer.backgroundColor = 0xffb18a;
	
	// Give the player the means to exit back to the menu 
	gameScreen.addChild( backButton );
	}

/*
* Desc: Handles the event when the player clicks on the tutorial button on
*   the main menu. Adds the tutorial container and removes the title menu
*   container :
*/
function tutorialButtonClickHandler( e )
	{

	// Remove the menu screen from the display 
	stage.removeChild( titleScreen );
	
	// Add the tutorial screen to the display 
	stage.addChild( tutorialScreen );
	
	// Since the scale of the tutorial room is different, we want to draw our tiles differently, 
	// So the scale will be different for the tiles as well 
	const tileSize = 34/2; 

	// Create the text we want to be on the tutorial screen 
  var tutorialText = new PIXI.Text( "Use 'a' and 'd' to move left and right\nUse 'w' to jump" );
	tutorialScreen.addChild( tutorialText );
  tutorialText.position.x = 400/4;
	tutorialText.position.y = 500/4;
	tutorialText.scale.x = 0.4; 
	tutorialText.scale.y = 0.4; 
	tutorialText.anchor.x = 0.5;
	tutorialText.anchor.y = 0.5;
	
	// Create the tileMap background for the tutorial 
	var background = new PIXI.Container(); 

		// Since we are only creating one line, we do not need the y axis 
		for( let x = 0; x < tileMap.height; x++ )
			{

			// Save the tile position we are going to place this tile at 
			let tile = tileMap.tutorialTiles[ x ]; 
			
			// Save the tile that we are going to place 
			let sprite = new PIXI.Sprite( tileSet[ tile - 1 ]); 
			
			// Ensure that the tile's anchor is its center 
			sprite.anchor.x = 0.0; 
			sprite.anchor.y = 0.0; 
			
			// Set the tile's position by multiplying the size of the tile the order it's in on this axis 
			sprite.x = (x * ( tileSize )); 
			
			// Since we are only creating one line of tiles, the y value is static 
			sprite.y = 80; 
			
			// Since the tutorialScreen is half its normal size, so must the sprite 
			sprite.scale.x = 0.5; 
			sprite.scale.y = 0.5; 
			
			// Add the sprite to our background container 
			background.addChild( sprite ); 			
			}

	// Since the tutorial screen has an active player character, we can tell the program that the game is running 
	gameRunning = true; 
	
	renderer.backgroundColor = 0x7dadff;
	
	// Add our functionality to the tutorial screen 
  tutorialScreen.addChild( playerVis ); 
  tutorialScreen.addChild( backButton );
	tutorialScreen.addChild( background ); 
	
	}

/*
* Desc: Function that handles when the credits button is clicked on in th menu
*   It adds the credits container to the stage, removes the title container,
*   and populates the credits container
*/
function creditsButtonClickHandler( e )
	{

	// Remove the menu screen from the display 
	stage.removeChild( titleScreen );
	
	// Add our credits screen to the display 
	stage.addChild( creditsScreen );
	
	// Create the text we want to be displayed 
  var creditsText = new PIXI.Text( "Game was made by\nKellar ...\nAndrew Munoz\nJoshus Tenakhongva" );
  creditsText.position.x = 400/4;
	creditsText.position.y = 200/3;
	creditsText.scale.x = 0.5; 
	creditsText.scale.y - 0.5; 
  creditsText.position.x = 400;
	creditsText.position.y = 200;
	creditsText.anchor.x = 0.5;
	creditsText.anchor.y = 0.5;

	renderer.backgroundColor = 0xff759c;
	
	// Add the functionality we want to the credits screen 
  creditsScreen.addChild( creditsText );
	creditsScreen.addChild( backButton );
	}

/*
* Desc: When clicked, will bring the player back to the main menu.
*/
function backButtonClickHandler( e )
	{

	// Add the title screen to the display 
	stage.addChild( titleScreen );
	
	// Remove all other possible containers from the stage 
	stage.removeChild( playerVis );
	stage.removeChild( gameScreen );
	stage.removeChild( creditsScreen );
	stage.removeChild( tutorialScreen );
	stage.removeChild( world ); 
	
	// The game should not be running on this menu, so always turn it off 
	gameRunning = false;

	renderer.backgroundColor = 0x6ac48a;
	}
/*
*	Moves the camera relative to the player's position
*/
/*
function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}
*/ 

/*
* Desc: Calculate player/ground collsion based on the tileMap 
*/ 
function playerOnGround( posX, posY )
	{
		
	// Find the location of the tile the player is currently standing on or right above 
	var xTileLocation = Math.floor( posX / 34 ); 
	var yTileLocation = Math.floor( posY / 34 ); 
	
	// Find the tile's index in the tileMap for the tile that player is standing on or right above 
	var tileLocation = yTileLocation * tileMap.width + xTileLocation; 
	
	// Find that tile's ID 
	var tileOn = tileMap.tiles[ tileLocation ]; 
	
	// Check to see if block to the right of the player is blocked
	if( tileMap.tiles[ tileLocation - 16 ] == RIGHT_SLOPE )
	{
		rightBlocked = true;
		console.log("right blocked\n");
	}
	else
	{
		rightBlocked = false;
	}
	
	//Check to see if block to the right of the player is blocked
	if( tileMap.tiles[ tileLocation - 16 ] == LEFT_SLOPE )
	{
		leftBlocked = true;
		console.log("left blocked\n");
	}
	else
	{
		leftBlocked = false;
	}
	
	// Check if the tile we're's ID is a solid platform 
	if( tileOn == FLAT_GROUND ||
			tileOn == RIGHT_SLOPE ||
			tileOn == LEFT_SLOPE || 
			tileOn == BEDROCK )
		{
		
		// If the player is on solid ground, return true 
		return true; 
		}
	// Otherwise, we're in the air
	return false; 
	}
	
