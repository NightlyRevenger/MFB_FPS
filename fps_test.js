var cubePosX=0;
var boxSpeed=4;
var FPS1=60;
var FPS2=30;
var FPS1intervalID;
var FPS2intervalID;

var gui, guiElements, param = { color: '0xffffff' };
var render_stats1;
var render_stats2;

var camera, scene, renderer1, renderer2;
var mfbCube;

function init()
{
	var Width=document.getElementById("container1").offsetWidth;
	var Height=document.getElementById("container1").offsetHeight 
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, Width/Height, 0.1, 1000 );
	
	mfbCube;
	var loader = new THREE.TextureLoader();
	loader.load( 'mfb_logo_256.jpg', function ( texture ) 
	{

		var geometry = new THREE.BoxGeometry( 80, 31.2, 15.6 );
		var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
		mfbCube = new THREE.Mesh( geometry, material );
		scene.add(mfbCube);
	} );			
	
	camera.position.z = 100;
	camera.position.y = 18;
	camera.rotation.x = -15 * (Math.PI / 180);

	elt1=document.getElementById("container1");
	render_stats1 = new Stats();
	render_stats1.showPanel( 0 );
	render_stats1.domElement.style.position = 'absolute';
	render_stats1.domElement.style.top = String(elt1.offsetTop+1)+'px';
	render_stats1.domElement.style.left = String(elt1.offsetLeft)+'px';
	render_stats1.domElement.style.zIndex = 100;
	elt1.appendChild( render_stats1.dom );
	
	elt2=document.getElementById("container2");
	render_stats2 = new Stats();
	render_stats2.showPanel( 0 );
	render_stats2.domElement.style.position = 'absolute';
	render_stats2.domElement.style.top = String(elt2.offsetTop+1)+'px';
	render_stats2.domElement.style.left = String(elt2.offsetLeft)+'px';
	render_stats2.domElement.style.zIndex = 100;
	elt2.appendChild( render_stats2.dom );
	
	renderer1 = new THREE.WebGLRenderer( { antialias: true } );
	renderer1.setClearColor( 0x000000 );
	renderer1.setPixelRatio( window.devicePixelRatio );
	renderer1.setSize( Width,Height );
	document.getElementById("container1").appendChild( renderer1.domElement );

	renderer2 = new THREE.WebGLRenderer( { antialias: false } );
	renderer2.setClearColor( 0x000000 );
	renderer2.setPixelRatio( window.devicePixelRatio );
	renderer2.setSize( Width,Height );
	document.getElementById("container2").appendChild( renderer2.domElement );
}

function animate() 
{
	var lastTime = performance.now();
	var deltaTime=performance.now();
	
	var render1 = function () 
	{
		
		render_stats1.begin();			
		if (typeof mfbCube !== 'undefined') 
		{
			mfbCube.position.x=cubePosX;
		}
		
		render_stats1.end();			
		
		renderer1.render(scene, camera);

	};
	
	FPS1intervalID=setInterval( function () 
	{
		requestAnimationFrame( render1 );
		
	}, 1000/FPS1 );
	
	FPS2intervalID=setInterval( function () 
	{
		render_stats2.begin()
		renderer2.render(scene, camera);
		render_stats2.end();
		
	}, 1000/FPS2 );
	
}

function StartGL(fpsLimit, tgCanvas)  
{
			fpsLimit=1000/fpsLimit;
			var elt=document.getElementById(tgCanvas);
			var Width=document.getElementById(tgCanvas).offsetWidth;
			var Height=document.getElementById(tgCanvas).offsetHeight ;
			var scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera( 75, Width/Height, 0.1, 1000 );
			//camera = new THREE.OrthographicCamera( Width / -8, Width / 8, Height / 8, Height / -8, 1, 100 );
			
			if (typeof renderer !== 'undefined') 
					renderer.dispose();

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
				if (typeof FPS2intervalID !== 'undefined') 
					clearInterval(FPS2intervalID);
			}
		
			
			document.getElementById(tgCanvas).appendChild( renderer.domElement );

			var mfbCube;
			var loader = new THREE.TextureLoader();
			loader.load( 'mfb_logo_256.jpg', function ( texture ) 
			{

				var geometry = new THREE.BoxGeometry( 80, 31.2, 15.6 );
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
				mfbCube = new THREE.Mesh( geometry, material );
				scene.add(mfbCube);
			} );			
			
			camera.position.z = 100;
			camera.position.y = 18;
			camera.rotation.x = -15 * (Math.PI / 180);

			
			var render_stats = new Stats();
			render_stats.showPanel( 0 );
			render_stats.domElement.style.position = 'absolute';
			render_stats.domElement.style.top = String(elt.offsetTop+1)+'px';
			render_stats.domElement.style.left = String(elt.offsetLeft)+'px';
			render_stats.domElement.style.zIndex = 100;
			elt.appendChild( render_stats.dom );
			
			
		var deltaTime=performance.now()
		var lastTime = performance.now();
		var render = function () 
		{
			
			render_stats.begin();			
			if (typeof mfbCube !== 'undefined') 
			{
				mfbCube.position.x=cubePosX;
			}
			
			//deltaTime=performance.now()-lastTime;
			//lastTime = performance.now();
			//sleep(fpsLimit-deltaTime);
			
			render_stats.end();			
			
			renderer.render(scene, camera);

		};
		
		requestAnimationFrame( render );
		
		tmpIntervalID=setInterval( function () 
		{
			requestAnimationFrame( render );
			
		}, fpsLimit );
		
		if(tgCanvas=="container2")
			FPS2intervalID=tmpIntervalID;
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
	
