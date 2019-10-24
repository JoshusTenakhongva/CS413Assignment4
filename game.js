var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ width: 800, height: 600, backgroundColor: 0x6ac48a });

gameport.appendChild( renderer.view );

/* 
Different containers for different menus
*/ 
var stage = new PIXI.Container();

var titleScreen = new PIXI.Container(); 
var gameScreen = new PIXI.Container(); 
var creditsScreen = new PIXI.Container(); 
var tutorialScreen = new PIXI.Container(); 

stage.addChild( titleScreen ); 

/*
* Create menu buttons 
*/ 
var startButton = new PIXI.Sprite( PIXI.Texture.fromImage( "startButton.png" ); 
startButton.position.x = 450; 
startButton.position.y = 400; 
startButton.anchor.x = 0.5; 
startButton.anchor.y = 0.5; 

var tutorialButton = new PIXI.Sprite( PIXI.Texture.fromImage( "tutorialButton.png" ); 
var creditsButton = new PIXI.Sprite( PIXI.Texture.fromImage( "creditsButton.png" ); 
var backButton = new PIXI.Sprite( PIXI.Texture.fromImage( "backButton.png" ); 

var	player = {//player's metadata
		x: 200,
		y: 100,
		speed: 3,
		xVel: 0,
		yVel: 0,
		onGround: false,
		isJumping: false		
	};
	

function animate()
	{
	requestAnimationFrame( animate );
	renderer.render( stage ); 
	}
	


animate(); 

/*
function initializeTitleScreen()
	{
		
	titleScreen.addChild( startButton ); 
	startButton.interactive = true; 
	//startButton.on( 'mousedown', startButtonClickHandler ); 
	
	var titleText = new PIXI.Text( "Video Game" ); 
	titleText.position.x = 300; 
	titleText.position.y = 400; 
	titleText.anchor.x = 0.5;
	titleText.anchor.y = 0.5; 
	} */ 
