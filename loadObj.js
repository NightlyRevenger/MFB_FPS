function testFunck()
{
	return 42;
}

function loadObjModel(modelAddr)
{
	var geometry  = new THREE.Geometry();
	geometry.verticesNeedUpdate=true;
	
	$.ajax
	({  
        url: modelAddr,
		cache: false, 
		async: false,
        type : 'GET',
        success: function(msg)
		{  
			geometry=prcessObj(msg)

        },
		error: function()
		{
			var test=0;
			test+=1;
		}		
    }); 

	geometry.verticesNeedUpdate=true;
	return geometry;
}

function prcessObj(data)
{
	var lines = data.split('\n');
	var lastPos=0;
	
	var geometry = new THREE.Geometry();
	geometry.verticesNeedUpdate=true;
	
	for (i = 0; i < lines.length; i++)
	{
		if( lines[i].startsWith('v ') )
		{
			var line=lines[i]
			var numbers = [];
			line.replace( /(\d[\d\.]*)/g, function( x ) { var n = Number(x); if (x == n) { numbers.push(x); }  });
			
			geometry.vertices.push(new THREE.Vector3(  numbers[0], numbers[1], numbers[2] ));
			lastPos=i;
		}
	}
	
	for (i = lastPos; i < lines.length; i++)
	{
		if( lines[i].startsWith('f') )
		{
			var line=lines[i]
			var numbers = [];
			//line.replace( /(\d[\d\.]*)/g, function( x ) { var n = Number(x); if (x == n) { numbers.push(x); }  });
			line.replace( /(\s[\d\.]*)/g, function( x ) { var n = Number(x); if (x == n) { numbers.push(x); }  });
			geometry.faces.push( new THREE.Face3( numbers[0]-1, numbers[1]-1, numbers[2]-1 ) );
		}
	}
	
	geometry.computeVertexNormals();
	geometry.computeBoundingSphere();	
	
	var test=0;
	test++;
	
	return geometry;	
}