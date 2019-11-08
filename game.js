/*********************************************
*			Gameport settings
**********************************************/
// Constants that determine the screen dimensions 
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ GAME_WIDTH, GAME_HEIGHT, backgroundColor: 0x6ac48a });

gameport.appendChild( renderer.view );

/*******************************************************
*     Constants
*******************************************************/

// Constants that hold the center of the X and Y axes
const CENTER_X = GAME_WIDTH / 2; 
const CENTER_Y = GAME_HEIGHT / 2; 

// Constants that hold the boundaries for thirds of the screen 
// X axis 
const LEFT_THIRD_DIVIDER = Math.floor( GAME_WIDTH * 0.333 ); 
const RIGHT_THIRD_DIVIDER = Math.floor( GAME_WIDTH * 0.667 ); 
// Y axis
const UPPER_THIRD_DIVIDER = Math.floor( GAME_HEIGHT * 0.333 ); 
const LOWER_THIRD_DIVIDER = Math.floor( GAME_HEIGHT * 0.667 ); 

// The starting x and y coordinates for the player 
const PC_START_X = 150;
const PC_START_Y = 150;

// A boolean that determines if the camera will be zoomed in or not 
const CAMERA_ZOOM = true;
// The amount that we want our camera to be zoomed in 
const GAME_SCALE = 2;

// Keyboard values for the movement keys 
const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

// The maximum amount of bullets the player can hold at once 
const BULLET_CAP = 6;
// The speed that the bullets will move at 
const BULLET_SPEED = 13;

/*****************************************************
*     Global Variables
******************************************************/

// Create an instance of the bump collision engine 
let bump_engine = new Bump(PIXI); 

// Variable that we can use to get the x and y position of the mouse 
var mousePosition = getMousePosition();

// Determines if the game is being played rather than in a menu 
var gameRunning = false;

// The sensitivity of the camera
// The higher the number, the more sensitive the camera is 
/*
* ONLY WORKS ON A SCALE OF 1 - 10
*/ 
var camera_sensitivity = 7;  

// The offset that we will allow for the mouse to pan the camera 
/*
/ If the player wants to turn off mouse camera movement, set this to 0
*/ 
var pan_offset = 250; 

/*******************************************************
* 		Container Initialization
******************************************************/
/*
Different containers for different menus
*/
// main container 
var stage = new PIXI.Container();

// Main title screen
var titleScreen = new PIXI.Container();

/*
*  Main parent for all gameplay objects
*
* Constant gameplay objects will be in this container like...
* 	- The player character
* 	- Their bullets 
* 	- HUD elements 
*/ 
var gameplayScreen = new PIXI.Container();

// Screen that displays the credits 
var creditsScreen = new PIXI.Container();

// Screen that displays the tutorial 
var tutorialScreen = new PIXI.Container();

// Screen that lets the player change the options 
var optionsScreen = new PIXI.Container(); 

// Screen that appears if the player wants to pause during gameplay 
var pauseMenu = new PIXI.Container();

/*
* Useful if we want to incorporate different levels 
*
* Level specific gameplay objects willbe in this container like... 
* 	- Enemies
* 	- Their projectiles
* 	- Tilemaps
* 	- Sounds
*/ 
var level_1 = new PIXI.Container();

// Changes the zoom of the gameplay screen 
if( CAMERA_ZOOM )
  {

  gameplayScreen.scale.x = GAME_SCALE;
  gameplayScreen.scale.y = GAME_SCALE;
  }

/*
* Create title Screen buttons
*/
// Button that starts the game 
var startButton = new PIXI.Sprite( PIXI.Texture.fromImage( "startButton.png" ));
startButton.interactive = true;
startButton.on( 'mousedown', startButtonClickHandler );
startButton.position.x = 400;
startButton.position.y = 300;
startButton.anchor.x = 0.5;
startButton.anchor.y = 0.5;

// Button that takes the player to the tutorial 
var tutorialButton = new PIXI.Sprite( PIXI.Texture.fromImage( "tutorialButton.png" ));
tutorialButton.interactive = true;
tutorialButton.on( 'mousedown', tutorialButtonClickHandler );
tutorialButton.position.x = 500;
tutorialButton.position.y = 500;
tutorialButton.anchor.x = 0.5;
tutorialButton.anchor.y = 0.5;

// Button that takes the player to the credits screen 
var creditsButton = new PIXI.Sprite( PIXI.Texture.fromImage( "creditsButton.png" ));
creditsButton.interactive = true;
creditsButton.on( 'mousedown', creditsButtonClickHandler );
creditsButton.position.x = 300;
creditsButton.position.y = 500;
creditsButton.anchor.x = 0.5;
creditsButton.anchor.y = 0.5;

// Button that takes the player back to the main menu 
var menuButton = new PIXI.Sprite( PIXI.Texture.fromImage( "menuButton.png" ));
menuButton.interactive = true;
menuButton.on( 'mousedown', menuButtonClickHandler );

// Begin the game by starting at the title screen 
stage.addChild( titleScreen );

/****************************************************
*     Tilemap Initialization
****************************************************/
PIXI.loader
	.add( 'tileSet', 'tileset.png' )
	.load( loadAssets ); 
	
var tileMapManager = 
	{

	testRoom_width: 10, 
	testRoom_height: 10, 
	testRoom_map: 
		[
		4, 5, 5, 5, 5, 5, 5, 5, 5, 6, 
		11, 12, 12, 12, 12, 12, 12, 12, 12, 13, 
		7, 3, 3, 3, 3, 3, 3, 3, 3, 10, 
		7, 3, 2, 2, 2, 2, 2, 2, 3, 10, 
		7, 3, 2, 1, 1, 1, 1, 2, 3, 10, 
		7, 3, 2, 1, 1, 1, 1, 2, 3, 10, 
		7, 3, 2, 2, 2, 2, 2, 2, 3, 10, 
		7, 3, 3, 3, 3, 3, 3, 3, 3, 10, 
		7, 3, 3, 3, 3, 3, 3, 3, 3, 10, 
		9, 5, 5, 5, 5, 5, 5, 5, 5, 8
		]
	}
	
var tileSetManager = 
	{
		
	tileSize: 50, 
	tileSet: [], 
	tileSet_width: 10, 
	tileSet_height: 2,
	
	tilesWithCollisionList: 
		[ 
		4, 5, 6, 7, 8, 9, 10, 
		11, 12, 13
		]
		
	
	}

/***********************************************************
*     Character Initialization
************************************************************/


/*
* An object that represents the information about the player 
*/ 
var player =
  {
	
	// Keeps track of the actual position of the player
  x: PC_START_X,
  y: PC_START_Y,
	
	// The speed the player will move at 
  speed: 1.5,
	
	// Booleans that determine which direction the player is moving 
  moveUp: false,
  moveDown: false,
  moveRight: false,
  moveLeft: false,
	
	// The radian rotation value of the player's aim relative to the player 
  aimRotation: 0,
	
	// The height and width of the player sprite / hitbox
  width: 30,
  height: 45,
	
	// The relative position of the player to the camera. VERY IMPORTANT
	relativeX: 0, 
	relativeY: 0
  };
	
// The sprite that represents the player character's body 
var PC_body = new PIXI.Sprite( PIXI.Texture.fromImage( "playerCharacter.png" ));
PC_body.anchor.x = 0.5;
PC_body.anchor.y = 0.5;
PC_body.position.x = player.x;
PC_body.position.y = player.y;

// The sprite that represents the gun of the player character 
var PC_blaster = new PIXI.Sprite( PIXI.Texture.fromImage( "blaster.png" ));
PC_blaster.anchor.x = 0.5;
PC_blaster.anchor.y = 1.2;
PC_blaster.position.x = player.x;
PC_blaster.position.y = player.y;

// An array that holds all of the player sprites, so they can all be updated easily
var PC_parts = [ PC_body, PC_blaster ];

// Variable that keeps track of how many bullets are left
var bulletNum = BULLET_CAP;

// An array that holds all of the live bullets shot by the PC 
var PC_live_bullets = [];

/************************************************************
*     Game Loop
*************************************************************/
function animate(timestamp)
{
	requestAnimationFrame(animate);
	
	// The core gameloop 
  if( gameRunning )
    {
		/*
		* The order of these 3 functions is important
		* 
		* updateCamera(): Determines relative Player position 
		* playerMovementHandler(): Moves the player (relative) position
		* calculate_PC_aim(): Reliant on relative player position 
		*/ 
		updateCamera();		
    playerMovementHandler();
    calculate_PC_aim();

		// Move the bullets and check if they're collided with anything or has 
		// gone off screen 
    for( var i = 0; i < PC_live_bullets.length; i++ )
      {

      handleBullet( PC_live_bullets[ i ] );
      }
    }
  renderer.render(stage);
 }

/************************************
*			Functions that will be run upon start up
************************************/ 
calculateCameraSensitivity(); 
initializeTitleScreen();
animate();

// Add all the event listeners for player controls 
document.addEventListener( 'mousedown', player_shoot );
document.addEventListener( 'keydown', keydown_PC_movement );
document.addEventListener( 'keyup', keyup_PC_movement );

/***********************************************************************
*     All Functions
*************************************************************************/

/*************************
*     Shooting/Bullet functions
***************************/
/*
* Desc: Used to find the position of the mouse and updates to mousePosition variable
*/
function getMousePosition(){ return renderer.plugins.interaction.mouse.global; }

/*
* Desc: Reduncant function to help with code readability 
*/ 
function player_shoot()
  {

  spawnBullet( "bullet.png" );
  }

/*
* Desc: Spawns a bullet on the player's location 
* Input: 
* 	- image: The png that we want the bullet to look like 
*/ 
function spawnBullet( image )
  {

  bullet = new PIXI.Sprite( PIXI.Texture.fromImage( image ));
  gameplayScreen.addChild( bullet );
  bullet.position.x = player.x;
  bullet.position.y = player.y;
  bullet.rotation = player.aimRotation;
  PC_live_bullets.push( bullet );
  }

/*
* Desc: General function that handles all of the bullet functions 
* Input: 
* 	- bullet: The specific bullet that we want to handle 
*/ 
function handleBullet( bullet )
  {

	// Save the position of the bullet, so we can use this variable a lot 
  var bulletX = bullet.position.x;
  var bulletY = bullet.position.y;

	// Move the bullet toward its destination 
  moveBullet( bullet );
	
	// Check if the bullet has collided with something 
	
		// Check if the bullet has collided with the environment 
		
		// Check if the bullet has collided with an enemy 

	// Check if the bullet has flown outside of the camera 
	checkBulletOutOfBounds( bullet, bulletX, bulletY );   
  }

/*
* Desc: Moves the bullet based on its speed and the direction its facing 
* Input: 
* 	- bullet: The specific bullet we want to move 
*/ 
function moveBullet( bullet )
  {

	// Math stuff that I don't really get, but it works. GEOMETERY!
  bullet.position.x = bullet.position.x + BULLET_SPEED * Math.cos( bullet.rotation );
  bullet.position.y = bullet.position.y + BULLET_SPEED * Math.sin( bullet.rotation );
  }
	
/*
* Desc: Checks if the bullet has left the confides we're okay with, and removes it 
* Input: 
* 	- bullet: the bullet we're checking up on
* 	- bulletX: The x position of the bullet 
* 	- bulletY: the y position of the bullet 
*/
function checkBulletOutOfBounds( bullet, bulletX, bulletY )
	{
		
	// Checks if the bullet has left our rectangle 
	if( bulletX > player.x + CENTER_X ||
      bulletX < player.x - CENTER_X ||
      bulletY > player.y + CENTER_Y ||
      bulletY < player.y - CENTER_Y )
    {
			
		// If so, remove it from the gameplayScreen 
    gameplayScreen.removeChild( bullet );
    }
	}

/*
* Desc: Calculates the rotation that our player will aim at 
*/ 
function calculate_PC_aim()
  {

	// Create variables that will hold vector between the mouse and player character
  var xDirection; 
  var yDirection;
	xDirection = mousePosition.x - player.relativeX; 
	yDirection = mousePosition.y - player.relativeY; 
	
	// Determine the angle that our player will shoot at 
  var angle = Math.atan2( yDirection, xDirection );
	
	// Save the rotation of our aim to the player object. 
	// This is the number we're using for the bullet math 
  player.aimRotation = angle - 0.025;
	
	// The sprite's rotation is slightly different and must be accounted for 
	// This number is only for the sprite 
  PC_blaster.rotation = angle + 1.57;
  }


/*******************************
*       Player movement functions
*******************************/

/*
* Desc: The event handler that will check if a WASD key is held 
*/ 
function keydown_PC_movement( key )
  {

	// Check if the player has pushed the W Key
  if( key.keyCode == W_KEY )
    { player.moveUp = true; }
	
	// Check if the player has pushed the A Key
  if( key.keyCode == A_KEY )
    { player.moveLeft = true; }
	
  // Check if the player has pushed the S Key
  if( key.keyCode == S_KEY )
    { player.moveDown = true; }
	
  // Check if the player has pushed the D Key
  if( key.keyCode == D_KEY )
    { player.moveRight = true; }
  }

/*
* Desc: Check if the player has let go of a WASD key 
*/ 
function keyup_PC_movement( key )
  {

	// Check if the player has left go of the W Key
  if( key.keyCode == W_KEY )
    { player.moveUp = false; }
  
	// Check if the player has left go of the A Key
  if( key.keyCode == A_KEY )
    { player.moveLeft = false; }
  
	// Check if the player has left go of the S Key
  if( key.keyCode == S_KEY )
    { player.moveDown = false; }
  
	// Check if the player has left go of the D Key
  if( key.keyCode == D_KEY )
    { player.moveRight = false; }
  }

/*
* Desc: Does the math to move the character 
*/ 
function playerMovementHandler()
  {

	// For all of these conditions, they will move the player based on its speed 
	// Checks if the player wants to move up
  if( player.moveUp == true )
    { player.y -= player.speed; }

	// Checks if the player wants to move down 
  if( player.moveDown == true )
    { player.y += player.speed; }
	
	// Checks if the player wants to move right
  if( player.moveRight == true )
    { player.x += player.speed; }

	// Checks if the player wants to move left 
  if( player.moveLeft == true )
    { player.x -= player.speed; }

	// Move all of the sprites that make up the player character 
  var i;
  for( i = 0; i < PC_parts.length; i++ )
    {
    PC_parts[ i ].position.x = player.x;
    PC_parts[ i ].position.y = player.y;
    }
  }

/*
* Desc: Add the sprites that make up the player character to our chosen container 
*/ 
function initializePlayer( screen )
	{

	var i;
	for( i = 0; i < PC_parts.length; i++ )
		{

		screen.addChild( PC_parts[ i ] );
		}
	}
	
/**********************************
*			Tile map functions 
**********************************/
/*
* Desc: function that will save our assets loaded through PIXI to the variablees 
* 			we are going to use. It will load 
* 				- The tile set 
*/ 
function loadAssets()
	{
		
	// Creating a short cut to the resources we've loaded 
	let resources = PIXI.loader.resources;
	
	const tileSetWidth = tileSetManager.tileSet_width;
	const tileSetHeight = tileSetManager.tileSet_height;
	const tileSize = tileSetManager.tileSize; 
	
	// Manually cut up our sprite sheet to create each of our tiles 
  for( let i = 0; i < tileSetWidth * tileSetHeight; i++ )
    {
			
		// Save the x "index" for the x position of our tile on the sprite sheet 
    let x = i % tileSetWidth;
		
		// Save the y "idnex" for the y position of our tiles on the sprite sheet 
    let y = Math.floor( i / tileSetWidth );

		// Cut out the piece of the sprite sheet that we want and save it to our tileset array 
    tileSetManager.tileSet.push
			( 
			new PIXI.Texture
				(
		
				// Retreive the entire sprite sheet 
				resources.tileSet.texture,
				
				// Cut out the specific tile we want during this iteration of the loop 
				// Add 1 to account for the margin on the outside border of the sprite sheet 
				new PIXI.Rectangle( x * tileSize, y * tileSize, tileSize, tileSize )
				)
			); 
    }
	}
	
/*
* Desc: Draws a specific tilemap onto a specific container 
* Input: 
* 	- map: The tilemap array that we're going to print 
* 	- tileMapHeight: The height of the tilemap measured in tiles 
* 	- tilemapWidth: The width of the tilemap measured in tiles 
* 	- container: The PIXI container that we want to print the tiles to 
*/ 
function drawTileMap( map, tileMapHeight, tileMapWidth, container )
	{
	
	// Save variables, so access to them is faster
	var tileSet = tileSetManager.tileSet; 
	var tileSize = tileSetManager.tileSize; 
	var tileMap = map; 
		
	// Loop through the Y axis of the tilemap 
	for( var y = 0; y < tileMapHeight; y++ )
		{
			
		// Loop through the X axis of the tilemap 
		for( var x = 0; x < tileMapWidth; x++ )
			{
	
			// Grab the tile ID from the tileMap that we're going to print 
			var tile = tileMap[ y * tileMapWidth + x ]; 
			
			// Obtain the tile that we want to print using its ID 
			var sprite = new PIXI.Sprite( tileSet[ tile - 1 ] ); 
			
			// Set the position and anchor of the tile 
			sprite.anchor.x = 0.0; 
			sprite.anchor.y = 0.0; 
			sprite.x = x * ( tileSize ); 
			sprite.y = y * ( tileSize ); 
			
			// Add the drawn tile to our background container 
			container.addChild( sprite ); 
			}		
		}
	}

/******************************
*     Menu functions
*******************************/
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
	var titleText = new PIXI.Text( "Top-Down Shooter" );
	titleText.position.x = 400;
	titleText.position.y = 200;
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
	// Add the containers necessary for gameplay to the stage
	stage.addChild( gameplayScreen );
	
	// Draw the tilemap for our test room 
	drawTileMap
		( 
		tileMapManager.testRoom_map, 
		tileMapManager.testRoom_height, 
		tileMapManager.testRoom_width, 
		gameplayScreen
		); 

	// Add the player to the gameplay screen
	initializePlayer( gameplayScreen );

	renderer.backgroundColor = 0xffb18a;

	// Give the player the means to exit back to the menu
	gameplayScreen.addChild( menuButton );
  if( CAMERA_ZOOM )
    {

    menuButton.scale.x = 1/GAME_SCALE;
  	menuButton.scale.y = 1/GAME_SCALE;
    }

  gameRunning = true;
	
	
	}

function tutorialButtonClickHandler( e )
	{

	// Remove the menu screen from the display
	stage.removeChild( titleScreen );
	// Add the tutorial screen to the display
	stage.addChild( tutorialScreen );

  // Create the text we want to be on the tutorial screen
  var tutorialText = new PIXI.Text( "Move with the WASD keys\nUse the mouse to aim and click to fire" );
  tutorialText.position.x = 400;
	tutorialText.position.y = 500;
	tutorialText.anchor.x = 0.5;
	tutorialText.anchor.y = 0.5;

  renderer.backgroundColor = 0x7dadff;
  tutorialScreen.addChild( menuButton );
  tutorialScreen.addChild( tutorialText );
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
  var creditsText = new PIXI.Text( "Game was made by\nKeller Mikkelson\nAndrew Munoz\nJoshus Tenakhongva" );
  creditsText.position.x = 400;
	creditsText.position.y = 200;
	creditsText.anchor.x = 0.5;
	creditsText.anchor.y = 0.5;

	renderer.backgroundColor = 0xff759c;

	// Add the functionality we want to the credits screen
  creditsScreen.addChild( creditsText );
	creditsScreen.addChild( menuButton );
	}

/*
* Desc: When clicked, will bring the player back to the main menu.
*/
function menuButtonClickHandler( e )
	{

	// Add the title screen to the display
	stage.addChild( titleScreen );
	// Remove all other possible containers from the stage
	stage.removeChild( gameplayScreen );
	stage.removeChild( creditsScreen );
	stage.removeChild( tutorialScreen );

	menuButton.scale.x = 1;
	menuButton.scale.y = 1;

	renderer.backgroundColor = 0x6ac48a;
  gameRunning = false;
	}

/************************************
*        Camera Movement
**************************************/
function updateCamera()
  {
	
	// Determine the amount we want to pan the camera based on mouse position 
	var panX = ( mousePosition.x - CENTER_X ); 
	var panY = ( mousePosition.y - CENTER_Y );
	
	// Check if the mouse has moved passed the area where we no longer want it to 
	// 	 move the camera. If it has, set the amount it can move the camera to the 
	// 	 maximum we want to set it to 
	if( panX > pan_offset ) { panX = pan_offset; }
	if( panX < -pan_offset ) { panX = -pan_offset; } 
	if( panY > pan_offset ) { panY = pan_offset; } 
	if( panY < -pan_offset ) { panY = -pan_offset; } 
	
	// Move the camera based on the player's position and mouse position. This changes if the camera is zoomed
	if( CAMERA_ZOOM )
		{
		gameplayScreen.x = (-player.x * GAME_SCALE + CENTER_X + -player.width/2) - ( panX/camera_sensitivity );
		gameplayScreen.y = (-player.y * GAME_SCALE + CENTER_Y + -player.height/2) - ( panY/camera_sensitivity );
		}
	else 
		{
		gameplayScreen.x = (-player.x + CENTER_X + -player.width/2) - ( panX/camera_sensitivity );
		gameplayScreen.y = (-player.y + CENTER_Y + -player.height/2) - ( panY/camera_sensitivity );
		}
 
	
	// Changes the player's position in relation to the camera. 
	/*
	* NECESSARY FOR COMPUTING THE DIRECTION THE PLAYER IS AIMING
	*/ 
	player.relativeX = CENTER_X + -player.width/2 - ( panX/camera_sensitivity ); 
	player.relativeY = CENTER_Y + -player.height/2 - ( panY/camera_sensitivity ); 
  }
	
/*
* Desc: Makes the variable, "camera_sensitivity" scale more intuitive. 
* 	Let's the higher the number, up to 10, determine the sensitivity 
*/ 
function calculateCameraSensitivity()
	{
		
	camera_sensitivity = Math.abs( camera_sensitivity - 11 ); 
	}
	
	
//	
