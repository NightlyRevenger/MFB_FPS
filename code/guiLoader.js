function buildGui() 
{
	clearGui();

	addGui( 'Speed', boxSpeed, function( val ) 
	{
		boxSpeed=val;
	}, false, 0.1,12 );
	
	addGui( 'FPS2', FPS2, function( val ) 
	{
		FPS2=val;
		CustomRender2.StopRender();
		CustomRender2.FPSLimit=FPS2;
		CustomRender2.StartRender();
	}, false, 1,30 );
	
	addGui( 'MotionBlur', MotionBlurStr, function( val ) 
	{
		MotionBlurStr=val;
		
		if(val==0)
			MotionBlurStr=90000;
		
		CustomRender1.MotionBlurVal=110-MotionBlurStr;
		CustomRender2.MotionBlurVal=110-MotionBlurStr;
	}, false, 0,100 );

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
