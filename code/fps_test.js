var cubePosX=0;
var boxSpeed=4;
var FPS1=60;
var FPS2=30;

var gui, guiElements, param = { color: '0xffffff' };

var CustomRender1;
var CustomRender2;


function StartRender()
{
	var render = function () 
	{
		CustomRender1.mfbCubeX=cubePosX;
		CustomRender1.RenderFrame()
	};
	
	/*setInterval( function () 
	{
		requestAnimationFrame(render);		
	}, 1000/60.0 );//*/
	
	CustomRender2.StartRender();
	
	animate();
}

function animate() 
{
	requestAnimationFrame( animate );
	
	CustomRender1.mfbCubeX=cubePosX;
	CustomRender1.RenderFrame()
}



function sleep(ms) 
{
	var ms2 = ms + performance.now();
	while (performance.now() < ms2)
	{
		//console.log("sleeping ")
	}
}

function moveCube(speed) 
{
	cubePosX+=speed;
	if(cubePosX> 420.0)
	{
		cubePosX=-420.0;
	}
}

function fpsLock(fps) 
{			
	lastTime = Date.now()
	requestAnimationFrame = function ( callback ) 
	{
		var currTime = Date.now(), timeToCall = Math.max( 0, 1000/(fps) - ( currTime - lastTime ) );
		var id = self.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
		lastTime = currTime + timeToCall;
		return id;
	};	
}
