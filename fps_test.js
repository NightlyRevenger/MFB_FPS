var cubePosX=0;
var boxSpeed=2;
var FPS1=60;
var FPS1intervalID;
var FPS2intervalID;

var gui, guiElements, param = { color: '0xffffff' };
function StartGL(fpsLimit, tgCanvas)  
{
			fpsLimit=1000/fpsLimit;
			var elt=document.getElementById(tgCanvas);
			var Width=document.getElementById(tgCanvas).offsetWidth;
			var Height=document.getElementById(tgCanvas).offsetHeight ;
			var scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera( 75, Width/Height, 0.1, 1000 );
			//camera = new THREE.OrthographicCamera( Width / -8, Width / 8, Height / 8, Height / -8, 1, 100 );

			var renderer = new THREE.WebGLRenderer({ antialias: true });
			
			renderer.setSize( Width,Height );
			renderer.shadowMap.enabled = false;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			renderer.gammaInput = true;
			renderer.gammaOutput = true;
			
			renderer.setClearColor(0x000000, 1);
			//renderer.setClearColor(0xFFFFFF, 1);
			while (elt.hasChildNodes())
			{
				elt.removeChild(elt.lastChild);
				if (typeof FPS1intervalID !== 'undefined') 
					clearInterval(FPS1intervalID);
			}
		
			
			document.getElementById(tgCanvas).appendChild( renderer.domElement );

			var mfbCube;
			var loader = new THREE.TextureLoader();
			loader.load( 'mfb_logo_256_2.jpg', function ( texture ) 
			{

				var geometry = new THREE.BoxGeometry( 80, 31.2, 15.6 );
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
				mfbCube = new THREE.Mesh( geometry, material );
				scene.add(mfbCube);
				//mfbCube.translateY(-10.105);
			} );			
			
			camera.position.z = 100;
			camera.position.y = 18;
			camera.rotation.x = -15 * (Math.PI / 180);

			
			//render_stats = new Stats();
			//render_stats.domElement.style.position = 'absolute';
			//render_stats.domElement.style.top = String(elt.offsetTop+1)+'px';
			//render_stats.domElement.style.zIndex = 100;
			//document.getElementById( tgCanvas ).appendChild( render_stats.domElement );
			var render_stats = new Stats();
			render_stats.showPanel( 0 );
			render_stats.domElement.style.position = 'absolute';
			render_stats.domElement.style.top = String(elt.offsetTop+1)+'px';
			render_stats.domElement.style.left = String(elt.offsetLeft)+'px';
			render_stats.domElement.style.zIndex = 100;
			elt.appendChild( render_stats.dom );
			
			lastTime = Date.now()
			requestAnimationFrame = function ( callback ) {
			  var currTime = Date.now(), timeToCall = Math.max( 0, 1000/120.0 - ( currTime - lastTime ) );
			  var id = self.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
			  lastTime = currTime + timeToCall;
			  return id;
			};
			

		var render = function () 
		{
			
			render_stats.begin();
			
			if (typeof mfbCube !== 'undefined') 
			{
				mfbCube.position.x=cubePosX;
			}
			
			render_stats.end();

			renderer.render(scene, camera);

		};
		
		//render();
		requestAnimationFrame( render );
		
		tmpIntervalID=setInterval( function () 
		{
			requestAnimationFrame( render );
		}, fpsLimit );
		
		if(tgCanvas=="container1")
			FPS1intervalID=tmpIntervalID;
}

function sleep(ms) 
{
	ms += new Date().getTime();
	while (new Date() < ms){}
}

function moveCube(speed) 
{
	cubePosX+=speed;
	if(cubePosX> 380.6)
	{
		cubePosX=-385.9;
	}	
}
	
