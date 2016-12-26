var camera;
var spotLight;
var gui, guiElements, param = { color: '0xffffff' };

function InitHandlers()
{
	var elem = document.getElementById('container1');

    if (elem.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        elem.addEventListener("wheel", onWheel);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        elem.addEventListener("mousewheel", onWheel);
      } else {
        // Firefox < 17
        elem.addEventListener("MozMousePixelScroll", onWheel);
      }
    } else { // IE8-
      elem.attachEvent("onmousewheel", onWheel);
    }
	
	if (elem.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        elem.addEventListener("mousemove", onMove);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        elem.addEventListener("mousemove", onMove);
      } else {
        // Firefox < 17
        elem.addEventListener("mousemove", onMove);
      }
    } else { // IE8-
      elem.attachEvent("mousemove", onMove);
    }	
	
}

function onWheel(e) 
{
      e = e || window.event;

      // deltaY, detail содержат пиксели
      // wheelDelta не дает возможность узнать количество пикселей
      // onwheel || MozMousePixelScroll || onmousewheel
      var delta = e.deltaY || e.detail || e.wheelDelta;

      //var info = document.getElementById('delta');
      //info.innerHTML = +info.innerHTML + delta;

      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
	  
	  camera.position.z += delta/2.0;
}
function onMove(e) 
{
      e = e || window.event;

      // deltaY, detail содержат пиксели
      // wheelDelta не дает возможность узнать количество пикселей
      // onwheel || MozMousePixelScroll || onmousewheel
      var delta = e.deltaY || e.detail || e.wheelDelta;

      //var info = document.getElementById('delta');
      //info.innerHTML = +info.innerHTML + delta;
	  
	if(e.buttons>0)
	{
		camera.rotation.x+=e.movementY/600.0;
		camera.rotation.y+=e.movementX/600.0;
	}

    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}


function getCoords() {
// вызывается при перемещении курсора
// над слоем с картой
  // координаты слоя с картой
  // в окне браузера
  imageMapX = findPosX(imageMap);
  imageMapY = findPosY(imageMap);
  imageMap.onmousemove = moveDot;
  imageMap.onmouseover = moveDot;
  // точку надо убирать, если курсор
  // покинул слой с картой
  imageMap.onmouseout = function (){
    myDot.style.display="none";
    };
  // координаты точки надо запомнить
  imageMap.onclick = coordsFix;
}

function StartGL()  
{  
			var Width=document.getElementById("container1").offsetWidth;
			var Height=document.getElementById("container1").offsetHeight ;
			var scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera( 75, Width/Height, 0.1, 1000 );

			var renderer = new THREE.WebGLRenderer({ antialias: true });
			
			renderer.setSize( Width,Height );
			renderer.shadowMap.enabled = false;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			renderer.gammaInput = true;
			renderer.gammaOutput = true;
			
			renderer.setClearColor(0x000000, 1);
			//renderer.setClearColor(0xFFFFFF, 1);
			document.getElementById("container1").appendChild( renderer.domElement );

			var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			//var geometry = new CreateGemotry()
			//geometry= loadObjModel('model/cup.obj');
			geometry= loadObjModel('model/mfb_model1.obj');
			
			var material = new THREE.MeshPhongMaterial();
			//var texture=THREE.ImageUtils.loadTexture('model/mfb_logo.jpg');
			//var material_tex = new THREE.MeshPhongMaterial( { map: texture } );
			//var cube = new THREE.Mesh( geometry, material_tex );
			//var cube = new THREE.Mesh( geometry);
			//cube.castShadow = true;
			//cube.receiveShadow = true;
			//cube.dynamic = true;
			
			var loader = new THREE.TextureLoader();
			loader.load( 'model/mfb_logo_256.jpg', function ( texture ) 
			{
				//var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
				//var material = new THREE.MeshPhongMaterial( { map: texture } );
				//var cube = new THREE.Mesh( geometry, material );
				//cube.castShadow = true;
				//cube.receiveShadow = true;	
				//scene.add( cube );
				//cube.translateY(1);
				//cube.translateZ(-40);
				//cube.translateX(-20);	
				var geometry = new THREE.BoxGeometry( 80, 31.2, 31.2 );
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
				var mesh = new THREE.Mesh( geometry, material );
				//group.add( mesh );
				scene.add(mesh);
			},
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			function ( xhr ) {
				console.log( 'An error happened' );
			}
			);
			
			var plane_geometry = new THREE.BoxGeometry( 220, 0.1, 220 );
			
			var plane_material = new THREE.MeshPhongMaterial();
			var plane = new THREE.Mesh( plane_geometry, plane_material );
			plane.castShadow = true;
			plane.receiveShadow = true;		
			
			spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
			var lightHelper;
			spotLight.position.set( 15, 25, 5 );
			spotLight.castShadow = true;
			spotLight.angle = Math.PI / 3;
			spotLight.penumbra = 0.05;
			spotLight.decay = 2;
			spotLight.distance = 200;
			spotLight.shadow.mapSize.width = 1024;
			spotLight.shadow.mapSize.height = 1024;
			spotLight.shadow.camera.near = 1;
			spotLight.shadow.camera.far = 200;
			lightHelper = new THREE.SpotLightHelper( spotLight );
			
			var spotLight2 = new THREE.SpotLight( 0xffffff, 1.5 );
			var lightHelper2;
			spotLight2.position.set( -20, 20, 5 );
			spotLight2.castShadow = true;
			spotLight2.angle = Math.PI / 3;
			spotLight2.penumbra = 0.05;
			spotLight2.decay = 2;
			spotLight2.distance = 200;
			spotLight2.shadow.mapSize.width = 1024;
			spotLight2.shadow.mapSize.height = 1024;
			spotLight2.shadow.camera.near = 1;
			spotLight2.shadow.camera.far = 200;
			lightHelper2 = new THREE.SpotLightHelper( spotLight2 );

			
			
			scene.add( plane );
			//scene.add( cube );
			scene.add( spotLight );
			scene.add( spotLight2 );
			//scene.add( lightHelper );
			//scene.add( lightHelper2 );
			
			camera.position.z = 115;
			camera.position.z = 30;
			camera.position.y = 18;
			//camera.position.x = -55;
			camera.rotation.x = -35 * Math.PI / 180;
			plane.translateY(-14);
			//cube.translateY(1);
			//cube.translateZ(-4);
			
			//var helper = new THREE.CameraHelper( spotLight1.shadow.camera );
			//scene.add( helper );
			
			render_stats = new Stats();
			render_stats.domElement.style.position = 'absolute';
			render_stats.domElement.style.top = '1px';
			render_stats.domElement.style.zIndex = 100;
			document.getElementById( 'container1' ).appendChild( render_stats.domElement );

			var render = function () 
			{
				requestAnimationFrame( render );

				//cube.rotation.x += 0.01;
				//cube.rotation.y += 0.01;
				//cube.translateZ(-0.05);
				//camera.rotation.y = 15 * Math.PI / 180;
				//camera.rotation.y = camera.rotation.y - (1 * Math.PI / 180);
				renderer.render(scene, camera);
				render_stats.update();
			};
			buildGui();
			render(); 
}

function CreateGemotry()  
{
	var geometry = new THREE.Geometry();
	
	geometry.vertices.push
	(
				new THREE.Vector3( -1,  1, 0 ),
				new THREE.Vector3( -1, -1, 0 ),
				new THREE.Vector3(  1, -1, 0 ),
				new THREE.Vector3(  1, -1, -25 )
	);
	
	geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geometry.faces.push( new THREE.Face3( 0, 1, 3 ) );
	geometry.computeBoundingSphere();
	
	return geometry;
}

function clearGui() 
{

	if ( gui ) gui.destroy();

	gui = new dat.GUI();

	gui.open();

}

function buildGui() 
{

	clearGui();

	addGui( 'light color', spotLight.color.getHex(), function( val ) {

		spotLight.color.setHex( val );
		//render();

	}, true );

	addGui( 'intensity', spotLight.intensity, function( val ) {

		spotLight.intensity = val;
		//render();

	}, false, 0, 2 );

	addGui( 'distance', spotLight.distance, function( val ) {

		spotLight.distance = val;
		//render();

	}, false, 0, 200 );

	addGui( 'angle', spotLight.angle, function( val ) {

		spotLight.angle = val;
		//render();

	}, false, 0, Math.PI / 3 );

	addGui( 'penumbra', spotLight.penumbra, function( val ) {

		spotLight.penumbra = val;
		//render();

	}, false, 0, 1 );

	addGui( 'decay', spotLight.decay, function( val ) {

		spotLight.decay = val;
		//render();

	}, false, 1, 2 );

}

function addGui( name, value, callback, isColor, min, max ) 
{

	var node;
	param[ name ] = value;

	if ( isColor ) {

		node = gui.addColor( param, name ).onChange( function() {

			callback( param[ name ] );

		} );

	} else if ( typeof value == 'object' ) {

		node = gui.add( param, name, value ).onChange( function() {

			callback( param[ name ] );

		} );

	} else {

		node = gui.add( param, name, min, max ).onChange( function() {

			callback( param[ name ] );

		} );

	}

	return node;

}
