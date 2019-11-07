const GAME_WIDTH = 800;
const CENTER_X = GAME_WIDTH / 2; 
const GAME_HEIGHT = 600;
const CENTER_Y = GAME_HEIGHT / 2; 
const GAME_SCALE = 4;

var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ GAME_WIDTH, GAME_HEIGHT, backgroundColor: 0x6ac48a });

gameport.appendChild( renderer.view );

/*******************************************************
*     Constants
*******************************************************/
const PC_START_X = 50;
const PC_START_Y = 50;
const CAMERA_ZOOM = false;
const PAN_DIVISOR = 2; 
const PAN_LIMITER = 250; 
const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;
const BULLET_CAP = 6;
const BULLET_SPEED = 13;

/*****************************************************
*     Variables
******************************************************/
var mousePosition = getMousePosition();
var gameRunning = false;
var player
player =
  {
  x: PC_START_X,
  y: PC_START_Y,
  speed: 1.5,
  moveUp: false,
  moveDown: false,
  moveRight: false,
  moveLeft: false,
  aimRotation: 0,
  width: 30,
  height: 45,
	relativeX: 0, 
	relativeY: 0
  };

/*******************************************************
* Container Initialization
******************************************************/
/*
Different containers for different menus
*/
var stage = new PIXI.Container();

var titleScreen = new PIXI.Container();
var gameplayScreen = new PIXI.Container();
var creditsScreen = new PIXI.Container();
var tutorialScreen = new PIXI.Container();
var pauseMenu = new PIXI.Container();

if( CAMERA_ZOOM )
  {

  gameplayScreen.scale.x = GAME_SCALE;
  gameplayScreen.scale.y = GAME_SCALE;
  }

var level_1 = new PIXI.Container();

/*
* Create title Screen buttons
*/
var startButton = new PIXI.Sprite( PIXI.Texture.fromImage( "startButton.png" ));
startButton.interactive = true;
startButton.on( 'mousedown', startButtonClickHandler );
startButton.position.x = 400;
startButton.position.y = 300;
startButton.anchor.x = 0.5;
startButton.anchor.y = 0.5;

var tutorialButton = new PIXI.Sprite( PIXI.Texture.fromImage( "tutorialButton.png" ));
tutorialButton.interactive = true;
tutorialButton.on( 'mousedown', tutorialButtonClickHandler );
tutorialButton.position.x = 500;
tutorialButton.position.y = 500;
tutorialButton.anchor.x = 0.5;
tutorialButton.anchor.y = 0.5;

var creditsButton = new PIXI.Sprite( PIXI.Texture.fromImage( "creditsButton.png" ));
creditsButton.interactive = true;
creditsButton.on( 'mousedown', creditsButtonClickHandler );
creditsButton.position.x = 300;
creditsButton.position.y = 500;
creditsButton.anchor.x = 0.5;
creditsButton.anchor.y = 0.5;

var menuButton = new PIXI.Sprite( PIXI.Texture.fromImage( "menuButton.png" ));
menuButton.interactive = true;
menuButton.on( 'mousedown', menuButtonClickHandler );

stage.addChild( titleScreen );

/****************************************************
*     Tilemap Initialization
****************************************************/


/***********************************************************
*     Character Initialization
************************************************************/
var PC_body = new PIXI.Sprite( PIXI.Texture.fromImage( "playerCharacter.png" ));
PC_body.anchor.x = 0.5;
PC_body.anchor.y = 0.5;
PC_body.position.x = player.x;
PC_body.position.y = player.y;

var PC_blaster = new PIXI.Sprite( PIXI.Texture.fromImage( "blaster.png" ));
PC_blaster.anchor.x = 0.5;
PC_blaster.anchor.y = 1.2;
PC_blaster.position.x = player.x;
PC_blaster.position.y = player.y;

var PC_parts = [ PC_body, PC_blaster ];

// Variable that keeps track of how many bullets are left
var bulletNum = BULLET_CAP;
var bullets = [];

/************************************************************
*     Game Loop
*************************************************************/
function animate(timestamp)
{
	requestAnimationFrame(animate);
  if( gameRunning )
    {
		//calculateRelativePC_position();
		updateCamera();		
    playerMovementHandler();
    calculate_PC_aim();
    

    for( var i = 0; i < bullets.length; i++ )
      {

      handleBullet( bullets[ i ] );
      }
    }
		
  document.getElementById( "mousex" ).innerHTML = gameplayScreen.x;
  document.getElementById( "mousey" ).innerHTML = gameplayScreen.y;
  document.getElementById( "charx" ).innerHTML = player.relativeX;
  document.getElementById( "chary" ).innerHTML = player.relativeY;
  renderer.render(stage);
 }

initializeTitleScreen();
animate();

document.addEventListener( 'mousedown', player_shoot );
document.addEventListener( 'keydown', keydown_PC_movement );
document.addEventListener( 'keyup', keyup_PC_movement );

/***********************************************************************
*     Functions
*************************************************************************/

/*************************
*     Shooting functions
***************************/
/*
* Desc: Used to find the position of the mouse and updates to mousePosition variable
*/
function getMousePosition(){ return renderer.plugins.interaction.mouse.global; }

function player_shoot()
  {

  spawnBullet( "bullet.png" );
  }

//
function spawnBullet( image )
  {

  bullet = new PIXI.Sprite( PIXI.Texture.fromImage( image ));
  gameplayScreen.addChild( bullet );
  bullet.position.x = player.x;
  bullet.position.y = player.y;
  bullet.rotation = player.aimRotation;
  bullets.push( bullet );
  }

function handleBullet( bullet )
  {

  var bulletX = bullet.position.x;
  var bulletY = bullet.position.y;

  moveBullet( bullet );

  if( bulletX > player.x + CENTER_X ||
      bulletX < player.x - CENTER_X ||
      bulletY > player.y + CENTER_Y ||
      bulletY < player.y - CENTER_Y )
    {
    gameplayScreen.removeChild( bullet );
    }
  }

function moveBullet( bullet )
  {

  bullet.position.x = bullet.position.x + BULLET_SPEED * Math.cos( bullet.rotation );
  bullet.position.y = bullet.position.y + BULLET_SPEED * Math.sin( bullet.rotation );
  }

function calculate_PC_aim()
  {

  var xDirection; 
  var yDirection;
	xDirection = mousePosition.x - player.relativeX; //player.x;
	yDirection = mousePosition.y - player.relativeY; //player.y;
	
  var angle = Math.atan2( yDirection, xDirection );
  player.aimRotation = angle - 0.025;
  PC_blaster.rotation = angle + 1.57;
  }

/*******************************
*       PLayer movement functions
*******************************/
function keydown_PC_movement( key )
  {


  if( key.keyCode == W_KEY )
    { player.moveUp = true; }
  //
  if( key.keyCode == A_KEY )
    { player.moveLeft = true; }
  //
  if( key.keyCode == S_KEY )
    { player.moveDown = true; }
  //
  if( key.keyCode == D_KEY )
    { player.moveRight = true; }
  }

function keyup_PC_movement( key )
  {

  if( key.keyCode == W_KEY )
    { player.moveUp = false; }
  //
  if( key.keyCode == A_KEY )
    { player.moveLeft = false; }
  //
  if( key.keyCode == S_KEY )
    { player.moveDown = false; }
  //
  if( key.keyCode == D_KEY )
    { player.moveRight = false; }
  }

function playerMovementHandler()
  {

  if( player.moveUp == true )
    { player.y -= player.speed; }

  if( player.moveDown == true )
    { player.y += player.speed; }

  if( player.moveRight == true )
    { player.x += player.speed; }

  if( player.moveLeft == true )
    { player.x -= player.speed; }

  var i;
  for( i = 0; i < PC_parts.length; i++ )
    {
    PC_parts[ i ].position.x = player.x;
    PC_parts[ i ].position.y = player.y;
    }
  }

function initializePlayer( screen )
	{

	var i;
	for( i = 0; i < PC_parts.length; i++ )
		{

		screen.addChild( PC_parts[ i ] );
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
  var tutorialText = new PIXI.Text( "Tutorial Text" );
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
	
	var panX = ( mousePosition.x - CENTER_X ); 
	var panY = ( mousePosition.y - CENTER_Y );
	if( panX > PAN_LIMITER ) { panX = PAN_LIMITER; }
	if( panX < -PAN_LIMITER ) { panX = -PAN_LIMITER; } 
	if( panY > PAN_LIMITER ) { panY = PAN_LIMITER; } 
	if( panY < -PAN_LIMITER ) { panY = -PAN_LIMITER; } 
  gameplayScreen.x = (-player.x + CENTER_X + -player.width/2) - ( panX/PAN_DIVISOR );
  gameplayScreen.y = (-player.y + CENTER_Y + -player.height/2) - ( panY/PAN_DIVISOR );
	
	player.relativeX = CENTER_X + -player.width/2 - ( panX/PAN_DIVISOR ); 
	player.relativeY = CENTER_Y + -player.height/2 - ( panY/PAN_DIVISOR ); 
  }
	
	
	
	
//	
