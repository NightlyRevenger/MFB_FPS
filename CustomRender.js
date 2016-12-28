class RenderContext
{
	constructor(fpsLimit, tgCanvas)
	{
		this.FPS=fpsLimit;
		this.tgCanvas=tgCanvas;
		this.DOMElement=document.getElementById(tgCanvas);
		this.Width=this.DOMElement.offsetWidth;
		this.Height=this.DOMElement.offsetHeight 
		
		//var cube={};
		//this.Cube=cube;
	}
	
	InitRender()
	{
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.Width/this.Height, 0.1, 1000 );
		
		var TexLoad = function (texture,obj) 
		{
			var geometry = new THREE.BoxGeometry( 80, 31.2, 15.6 );
			var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
			var mfbCube = new THREE.Mesh( geometry, material );
			
			obj.mfbCube=mfbCube;
		}
		
		var loader = new THREE.TextureLoader();
		loader.load( 'model/mfb_logo_256.jpg', TexLoad, this );
		
		this.camera.position.z = 100;
		this.camera.position.y = 18;
		this.camera.rotation.x = -15 * (Math.PI / 180);
		
		this.render_stats = new Stats();
		this.render_stats.showPanel( 0 );
		this.render_stats.domElement.style.position = 'absolute';
		this.render_stats.domElement.style.top = String(this.DOMElement.offsetTop+1)+'px';
		this.render_stats.domElement.style.left = String(this.DOMElement.offsetLeft)+'px';
		this.render_stats.domElement.style.zIndex = 100;
		this.DOMElement.appendChild( this.render_stats.dom );
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setClearColor( 0x000000 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.Width,this.Height );
		this.DOMElement.appendChild( this.renderer.domElement );
	}
	
	StartRender()
	{
		function func(renderClass) 
		{
			renderClass.mfbCubeX=cubePosX;
			renderClass.RenderFrame()			
		}
		
		this.RenderIntervalId=setInterval(func, 1000/this.FPS,this );
	}
	
	StopRender()
	{
		if (typeof this.RenderIntervalId !== 'undefined') 
		{
			clearInterval(this.RenderIntervalId);
		}		
	}
	
	RenderFrame()
	{
		this.render_stats.begin();
		this.renderer.render(this.scene, this.camera);
		this.render_stats.end();
	}
	
	set mfbCubeX(newValue) 
	{
		if (typeof this.Cube !== 'undefined') 
		{
			this.Cube.position.x=newValue;
		}
	}
	
	set mfbCube(newValue) 
	{
		this.Cube=newValue;
		this.scene.add(this.Cube);
	}
	
	get mfbCube() 
	{
		return this.Cube;
	}
	
	get FPSLimit() 
	{
		return this.FPS;
	}
	
	set FPSLimit(newValue) 
	{
		this.FPS=newValue;
	}

}