var GAME_WIDTH = 720;
var GAME_HEIGHT = 400;
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
titleScreen.scale.x = GAME_SCALE;
titleScreen.scale.y = GAME_SCALE;

var gameScreen = new PIXI.Container();
gameScreen.scale.x = GAME_SCALE;
gameScreen.scale.y = GAME_SCALE;

var creditsScreen = new PIXI.Container();
creditsScreen.scale.x = GAME_SCALE;
creditsScreen.scale.y = GAME_SCALE;

var tutorialScreen = new PIXI.Container();
tutorialScreen.scale.x = GAME_SCALE;
tutorialScreen.scale.y = GAME_SCALE;

stage.addChild( titleScreen );

/*
* Create menu buttons
*/
// Create start button
var startButton = new PIXI.Sprite( PIXI.Texture.fromImage( "startButton.png" ));
startButton.interactive = true;
startButton.on( 'mousedown', startButtonClickHandler );
startButton.position.x = 400;
startButton.position.y = 300;
startButton.anchor.x = 0.5;
startButton.anchor.y = 0.5;

// Create tutorial button
var tutorialButton = new PIXI.Sprite( PIXI.Texture.fromImage( "tutorialButton.png" ));
tutorialButton.interactive = true;
tutorialButton.on( 'mousedown', tutorialButtonClickHandler );
tutorialButton.position.x = 500;
tutorialButton.position.y = 500;
tutorialButton.anchor.x = 0.5;
tutorialButton.anchor.y = 0.5;

// create credits button
var creditsButton = new PIXI.Sprite( PIXI.Texture.fromImage( "creditsButton.png" ));
creditsButton.interactive = true;
creditsButton.on( 'mousedown', creditsButtonClickHandler );
creditsButton.position.x = 300;
creditsButton.position.y = 500;
creditsButton.anchor.x = 0.5;
creditsButton.anchor.y = 0.5;

// create back button
var backButton = new PIXI.Sprite( PIXI.Texture.fromImage( "backButton.png" ));
backButton.interactive = true;
backButton.on( 'mousedown', backButtonClickHandler );

var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

var world;
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

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map_json', 'testroom.json')
  .add('tileset', 'tileset.png')
  .add('blob', 'player_character.png')
  .load(ready);
//Createst the World and the Tileset background
function ready() 
{
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map_json", "tileset.png");
  stage.addChild(world);
  
  var blob = world.getObject("blob");
  
  player = new PIXI.Sprite(PIXI.loader.resources.blob.texture);
  player.x = blob.x;
  player.y = blob.y;
  player.anchor.x = 0.0;
  player.anchor.y = 1.0;

  // Find the entity layer
  var entity_layer = world.getObject("Entities");
  entity_layer.addChild(player);
 var entity_layer = world.getObject("Entities");
  entity_layer.addChild(player);

  player.direction = MOVE_NONE;
  player.moving = false;
  animate();
}

function animate(timestamp)
{
	requestAnimationFrame(animate);
	update_camera();
	renderer.render(stage);
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
	var titleText = new PIXI.Text( "Video Game" );
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
  // Add the container that holds the main game to the stage
	stage.addChild( gameScreen );
	stage.addChild(world);
	renderer.backgroundColor = 0xffb18a;
  gameScreen.addChild( backButton );
	}

/*
* Desc: Handles the event when the player clicks on the tutorial button on
*   the main menu. Adds the tutorial container and removes the title menu
*   container :
*/
function tutorialButtonClickHandler( e )
	{

	stage.removeChild( titleScreen );
	stage.addChild( tutorialScreen );

  var tutorialText = new PIXI.Text( "Tutorial Text" );
  tutorialText.position.x = 400;
	tutorialText.position.y = 200;
	tutorialText.anchor.x = 0.5;
	tutorialText.anchor.y = 0.5;

	renderer.backgroundColor = 0x7dadff;
  tutorialScreen.addChild( tutorialText );
  tutorialScreen.addChild( backButton );
	}

/*
* Desc: Function that handles when the credits button is clicked on in th menu
*   It adds the credits container to the stage, removes the title container,
*   and populates the credits container
*/
function creditsButtonClickHandler( e )
	{

	stage.removeChild( titleScreen );
	stage.addChild( creditsScreen );
  var creditsText = new PIXI.Text( "Game was made by\n" +
  "Kellar ...\nAndrew ...\nJoshus Tenakhongva");
  creditsText.position.x = 400;
	creditsText.position.y = 200;
	creditsText.anchor.x = 0.5;
	creditsText.anchor.y = 0.5;

	renderer.backgroundColor = 0xff759c;
  creditsScreen.addChild( creditsText );
	creditsScreen.addChild( backButton );
	}

/*
* Desc: When clicked, will bring the player back to the main menu. 
*/
function backButtonClickHandler( e )
	{

	stage.addChild( titleScreen );

	stage.removeChild( gameScreen );
	stage.removeChild( creditsScreen );
	stage.removeChild( tutorialScreen );

	renderer.backgroundColor = 0x6ac48a;
	}
/*
*	Moves the camera relative to the player's position
*/	
function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

