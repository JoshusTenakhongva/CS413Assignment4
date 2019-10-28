var GAME_WIDTH = 8000;
var GAME_HEIGHT = 600;
var GAME_SCALE = 4;

var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ GAME_WIDTH, GAME_HEIGHT, backgroundColor: 0x6ac48a });

gameport.appendChild( renderer.view );

/*
Different containers for different menus
*/
var stage = new PIXI.Container();
//stage.scale.x = GAME_SCALE;
//stage.scale.y = GAME_SCALE;

var titleScreen = new PIXI.Container();

var gameScreen = new PIXI.Container();
gameScreen.scale.x = GAME_SCALE;
gameScreen.scale.y = GAME_SCALE;

var creditsScreen = new PIXI.Container();

var tutorialScreen = new PIXI.Container();

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

function ready() 
{
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map_json", "tileset.png");
  
  
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
  
}

function animate(timestamp)
{
	requestAnimationFrame(animate);
	
	renderer.render(stage);
 }

function GameLoop()
{
	requestAnimationFrame(GameLoop);
	update_camera();
}

initializeTitleScreen();
animate();


/*
* Desc: Initializes the opening title screen for the game
*/
var GAME_WIDTH = 720;
var GAME_HEIGHT = 400;
var GAME_SCALE = 4;
// var HORIZON_Y = GAME_HEIGHT/GAME_SCALE/2;

var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH,
                                           GAME_HEIGHT,
                                           {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

// Scene objects get loaded in the ready function
var player;
var world;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {
  if (player.direction == MOVE_NONE) {
    player.moving = false;
    console.log(player.y);
    return;
  }
  player.moving = true;
  console.log("move");
  
  if (player.direction == MOVE_LEFT) {
    createjs.Tween.get(player).to({x: player.x - 32}, 500).call(move);
  }
  if (player.direction == MOVE_RIGHT)
    createjs.Tween.get(player).to({x: player.x + 32}, 500).call(move);

  if (player.direction == MOVE_UP)
    createjs.Tween.get(player).to({y: player.y - 32}, 500).call(move);
  
  if (player.direction == MOVE_DOWN)
    createjs.Tween.get(player).to({y: player.y + 32}, 500).call(move);
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (e.repeat == true) return;
  
  player.direction = MOVE_NONE;

  if (e.keyCode == 87)
    player.direction = MOVE_UP;
  else if (e.keyCode == 83)
    player.direction = MOVE_DOWN;
  else if (e.keyCode == 65)
    player.direction = MOVE_LEFT;
  else if (e.keyCode == 68)
    player.direction = MOVE_RIGHT;

  console.log(e.keyCode);
  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map_json', 'map.json')
  .add('tileset', 'tileset.png')
  .add('blob', 'blob.png')
  .load(ready);

function ready() {
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

  player.direction = MOVE_NONE;
  player.moving = false;

}

function animate(timestamp) {
  requestAnimationFrame(animate);
  update_camera();
  renderer.render(stage);
}

function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}
