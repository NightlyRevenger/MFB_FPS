class RenderContext
{
	constructor(fpsLimit, tgCanvas)
	{
		this.FPS=fpsLimit;
		this.tgCanvas=tgCanvas;
		this.DOMElement=document.getElementById(tgCanvas);
		this.Width=this.DOMElement.offsetWidth;
		this.Height=this.DOMElement.offsetHeight
		this.MotionBlurStrength=25;
		
		//var cube={};
		//this.Cube=cube;
	}
	
	InitRender()
	{
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.Width/this.Height, 0.1, 1000 );
		//this.camera = new THREE.OrthographicCamera( this.Width / - 2, this.Width / 2, this.Height / 2, this.Height / - 2, 1, 1000 );
		
		var texture = new THREE.TextureLoader().load( 'resources/mfb_logo_256.jpg' );
		var geometry = new THREE.BoxGeometry( 80, 31.2, 15.6 );
		var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
		var mfbCubeTmp = new THREE.Mesh( geometry, material );
		this.mfbCube=mfbCubeTmp;

		
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
		
		this.renderer = new THREE.WebGLRenderer({ 
			antialias: true,
			//alpha: true 
		});
		this.renderer.setClearColor( 0x000000 );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.Width,this.Height );
		this.DOMElement.appendChild( this.renderer.domElement );
		
		this.composer = new THREE.EffectComposer(this.renderer);
		this.composer.setSize(this.Width,this.Height );
		
		this.InitPostProcessing();
	}
	
	InitPostProcessing()
	{
		this.composer = new THREE.EffectComposer(this.renderer);
		this.composer.setSize(this.Width,this.Height );
		
		this.renderTarget = new THREE.WebGLRenderTarget(this.Width,this.Height);
		this.renderTarget.depthBuffer = true;
		this.renderTarget.depthTexture = new THREE.DepthTexture();
		
		var renderPass = new THREE.RenderPass(this.scene, this.camera);
		renderPass.renderToScreen=false;
		this.composer.addPass(renderPass);
		
		
		var vertexShade = this.ShaderLoader("resources/VertexSepiaShader.txt");
		var fragShade = this.ShaderLoader("resources/FragmentSepiaShader.txt");
		
		var shaderMaterial =
        new THREE.ShaderMaterial({
			uniforms: {
				"tDiffuse": { value: null },
				"amount":   { value: 1.0 }
			},
            fragmentShader: fragShade,
            vertexShader: vertexShade,
        });
		
		var sepiaPass = new THREE.ShaderPass(shaderMaterial);
		this.composer.addPass(sepiaPass);	
		sepiaPass.renderToScreen=true;
		
		this.motionBlur = new THREE.ShaderPass(motionBlurShader);
		this.motionBlur.renderToScreen=true;
		this.composer.addPass(this.motionBlur);
		
		
		this.previousMatrixWorldInverse = new THREE.Matrix4()
		this.previousProjectionMatrix = new THREE.Matrix4()
		this.previousCameraPosition = new THREE.Vector3()
		this.tmpMatrix = new THREE.Matrix4()
	}
	
	
	StartRender()
	{
		function func(renderClass) 
		{
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
		var delta=this.MotionBlurStrength;
		this.render_stats.begin();
		//this.renderer.render(this.scene, this.camera);
		this.renderer.render(this.scene, this.camera, this.renderTarget)
		
		this.motionBlur.material.uniforms.tColor.value = this.renderTarget.texture;
		this.motionBlur.material.uniforms.tDepth.value = this.renderTarget.depthTexture;
		this.motionBlur.material.uniforms.velocityFactor.value = 1;
		this.motionBlur.material.uniforms.delta.value = delta;
		// tricky part to compute the clip-to-world and world-to-clip matrices
		this.motionBlur.material.uniforms.clipToWorldMatrix.value
			.getInverse(this.camera.matrixWorldInverse).multiply(this.tmpMatrix.getInverse(this.camera.projectionMatrix));
		this.motionBlur.material.uniforms.previousWorldToClipMatrix.value
			.copy(this.previousProjectionMatrix.multiply(this.previousMatrixWorldInverse));
		this.motionBlur.material.uniforms.cameraMove.value.copy(this.camera.position).sub(this.previousCameraPosition);

  
		this.composer.render(delta);
		
		this.previousMatrixWorldInverse.copy(this.camera.matrixWorldInverse)
		this.previousProjectionMatrix.copy(this.camera.projectionMatrix)
		this.previousCameraPosition.copy(this.camera.position)
		  
		this.render_stats.end();
	}
	
	set mfbCubeX(newValue) 
	{
		if (typeof this.Cube !== 'undefined') 
		{
			//this.Cube.position.x=newValue;
			this.camera.position.x=newValue*-1;
			//this.camera.rotation.y=newValue;
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
	
	get MotionBlurVal() 
	{
		return this.MotionBlurStrength;
	}
	
	set MotionBlurVal(newValue) 
	{
		this.MotionBlurStrength=newValue;
	}
	
	ShaderLoader(vertex_url) 
	{
		var text = "";

		$.ajax({
			type: "GET",
			url: vertex_url,
			//type: "text",
			success: function (result) {
				text = result;
			},
			async: false
		});
		
		return text;
	}
}
