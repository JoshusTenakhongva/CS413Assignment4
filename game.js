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
// Create start button 
var startButton = new PIXI.Sprite( PIXI.Texture.fromImage( "startButton.png" )); 
startButton.interactive = true; 
startButton.on( 'mousedown', startButtonClickHandler ); 
startButton.position.x = 450; 
startButton.position.y = 400; 
startButton.anchor.x = 0.5; 
startButton.anchor.y = 0.5; 

// Create tutorial button 
var tutorialButton = new PIXI.Sprite( PIXI.Texture.fromImage( "tutorialButton.png" ));

// create credits button  
var creditsButton = new PIXI.Sprite( PIXI.Texture.fromImage( "creditsButton.png" ));

// create back button  
var backButton = new PIXI.Sprite( PIXI.Texture.fromImage( "backButton.png" )); 
backButton.interactive = true; 
backButton.on( 'mousedown', backButtonClickHandler ); 

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
	
initializeTitleScreen(); 
animate(); 


function initializeTitleScreen()
	{
		
	titleScreen.addChild( startButton ); 
	
	
	var titleText = new PIXI.Text( "Video Game" ); 
	titleText.position.x = 300; 
	titleText.position.y = 400; 
	titleText.anchor.x = 0.5;
	titleText.anchor.y = 0.5; 
	
	titleScreen.addChild( titleText ); 
	} 
	
/*
* menu button click handler functions 
*/ 
function startButtonClickHandler( e )
	{
		
	stage.removeChild( titleScreen ); 
	stage.addChild( gameScreen ); 
	gameScreen.addChild( backButton ); 
	
	renderer.backgroundColor = 0xffb18a; 
	}
	
function tutorialButtonClickHandler( e )
	{
		
	stage.removeChild( titleScreen ); 
	stage.addChild( tutorialScreen ); 
	
	renderer.backgroundColor = 0x7dadff; 
	}
	
function creditsButtonClickHandler( e )
	{

	stage.removeChild( titleScreen ); 
	stage.addChild( creditsScreen ); 
	
	renderer.backgroundColor = 0xff759c; 
	
	creditsScreen.addChild( backButton ); 
	}	

function backButtonClickHandler( e )
	{
		
	stage.addChild( titleScreen ); 
	
	stage.removeChild( gameScreen );
	stage.removeChild( creditsScreen ); 
	stage.removeChild( tutorialScreen ); 
	
	renderer.backgroundColor = 0x6ac48a; 
	}
	

