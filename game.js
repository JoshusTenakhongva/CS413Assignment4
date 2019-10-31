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

function animate(timestamp)
{
	requestAnimationFrame(animate);
	renderer.render(stage);
 }

animate();
