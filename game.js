var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer(
												{ width: 800, height: 600, backgroundColor: 0x6ac48a });
gameport.appendChild( renderer.view );

var stage = new PIXI.Container();

function animate()
	{
	requestAnimationFrame( animate );
	renderer.render( stage ); 
	}

animate(); 