function buildGui() 
{
	clearGui();

	addGui( 'Speed', boxSpeed, function( val ) 
	{
		boxSpeed= val;
	}, false, 0.1,12 );
	
	addGui( 'FPS2', FPS2, function( val ) 
	{
		FPS2=val;		
		if (typeof FPS2intervalID !== 'undefined') 
					clearInterval(FPS2intervalID);
		
		FPS2intervalID=setInterval( function () 
		{
			render_stats2.begin()
			renderer2.render(scene, camera);
			render_stats2.end();			
		}, 1000/FPS2 );

	}, false, 1,30 );

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
function clearGui() 
{
	if ( gui ) gui.destroy();
	gui = new dat.GUI();

	//var customContainer = document.getElementById('my-gui-container');
	//customContainer.appendChild(gui.domElement);

	gui.open();
}
