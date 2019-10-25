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
