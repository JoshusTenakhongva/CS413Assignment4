var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ width: 800, height: 600, backgroundColor: 0x6ac48a });
												{ width: 800, height: 600, backgroundColor: 0x6ac48a });
gameport.appendChild( renderer.view );

var stage = new PIXI.Container();

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