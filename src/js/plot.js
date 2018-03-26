$( document ).ready(function() {
	MLdata = document.getElementById('MLdata');
	bvalidation = true;
	bPlaneTest = false;
	bParabolaTest = false;

	var training_all = {};
	var training_aml = {};
	var parabola = {};
	var plane = {}; 

	Plotly.d3.csv('../data/train_PCA_normalized.csv', function(err, rows){

		function unpack(rows, key) {
		  return rows[key]; ;
		}
		  

		var z_data=[];
		var y_data = [];
		var x_data = [];

		var all_z_data=[];
		var all_y_data = [];
		var all_x_data = [];

		var aml_z_data=[];
		var aml_y_data = [];
		var aml_x_data = [];

		//parse the rows of the csv file and write into above arrays
		for(i=0;i<rows.length;i++)
		{
		  var row = unpack(rows,i);
		  if (row['label'] == 'ALL') {
		  	all_x_data.push(parseFloat(row['x']));
			all_y_data.push(parseFloat(row['y']));
			all_z_data.push(parseFloat(row['z']));
		  } else {
		  	aml_x_data.push(parseFloat(row['x']));
			aml_y_data.push(parseFloat(row['y']));
			aml_z_data.push(parseFloat(row['z']));
		  }
		  x_data.push(parseFloat(row['x']));
		  y_data.push(parseFloat(row['y']));
		  z_data.push(parseFloat(row['z']));

		}


		
		training_aml = {
			x:aml_x_data, y: aml_y_data, z: aml_z_data,
			
			showlegend: true,
			name:'training ALL set',

			mode: 'markers',
			marker: {
				symbol:'diamond-open',
				size: 8,
				color: 'red',
				line: {
				color: 'rgba(0, 0, 0, 0.14)',
				width: 0.5},
				opacity: 0.9},
			type: 'scatter3d'
		};

		training_all = {
			x:all_x_data, y: all_y_data, z: all_z_data,
			
			showlegend: true,
			name:'training AML set',

			mode: 'markers',
			marker: {
				symbol:'diamond-open',
				size: 8,
				color: 'blue',
				line: {
				color: 'rgba(0, 0, 0, 0.14)',
				width: 0.5},
				opacity: 0.9},
			type: 'scatter3d'
		};

		//initialize equations for the plane
		x_eq = parseFloat('0.04820578');
		y_eq = parseFloat('-0.05290853');
		z_eq = parseFloat('-0.00197103');
		intercept = parseFloat('-0.421052631579');

		var min_x_data = Math.min.apply(Math, x_data);
		var max_x_data = Math.max.apply(Math, x_data);
		var min_y_data = Math.min.apply(Math, y_data);
		var max_y_data = Math.max.apply(Math, y_data);

		max_y_data = max_y_data * 2 / 3;
		min_x_data = min_x_data * 2 / 3;
		var split = 5;

		var x = [];
		var y = [];
		var z = [];

		//calculate the linspace of x,y
		for (var i = 0; i < split; i++) {
			var next_x = min_x_data + i * (max_x_data - min_x_data) / split;
			var next_y = min_y_data + i * (max_y_data - min_y_data) / split;
			x.push(next_x);
			y.push(next_y);
			
		}


		//calculate z
		for (var i = 0; i < split; i++) {
			var next_z = []
			for (var j = 0; j < split; j++) {
				var global_plane = (-x_eq * x[j] - y_eq * y[i] - intercept) /z_eq;
				next_z.push(global_plane);
			}
			z.push(next_z);
		}


		var colorscale = [[0.0, 'rgb(51,181,229)'],
			[0.5, 'rgb(240,240,240)'],
		 	[1.0, 'rgb(51,181,229))']];


		plane = {
			x:x, 
			y:y, 
			z:z,
			
		    colorscale: colorscale,
		    
			name: 'Decision Boundary',
			type: 'surface',
			opacity: .95
		}	

		//initialize equations for the paraboloid
		x_p = parseFloat('5.27686946e-02');
		x_sq_p = parseFloat('-1.09643754e-03');
		xy_p = parseFloat('9.59967953e-04');
		xz_p = parseFloat('7.72753386e-04');
		y_p = parseFloat('-7.08321873e-02');
		y_sq_p = parseFloat('9.72229635e-04');
		yz_p = parseFloat('-7.29964534e-04');
		z_p = parseFloat(' 1.06694480e-02');
		z_sq_p = parseFloat('-2.97527472e-06')
		intercept_p = parseFloat('-0.391230128041');



		para_z = []
		para_x = []
		para_y = []
		max_y_data = max_y_data * 2 / 3;
		min_x_data = min_x_data * 2 / 3;
		var para_points = 1000.0;

		for (var i = min_y_data; i < max_y_data; i += (max_y_data - min_y_data) / para_points) {
			var next_z = []
			para_y.push(i);

			for (var j = min_x_data; j < max_x_data; j += (max_x_data - min_x_data) / para_points) {
				para_x.push(j);

				// var rand_offset = Math.pow(Math.e, -(Math.pow((j-xdisp),2)/30 - (Math.pow((i-ydisp),2)/60));
				// console.log(rand_offset);
				var a = z_sq_p;
				var b = yz_p * i + xz_p * j + z_p;
				var c = intercept_p + (xy_p * i + x_p + x_sq_p * j) * j + (y_p + y_sq_p * i) * i
				var n = b * b - 4.0 * a * c;

				var global_paraboloid = (-b + Math.sqrt(b * b - 4.0 * a * c)) / (2.0 * a);
				next_z.push(global_paraboloid);
			}
			para_z.push(next_z);
		}


		parabola = {
			x: para_x,
			y: para_y,
			z: para_z, 
			visible: false,
			name:"Decision Boundary",
			type: 'surface',
			colorscale: colorscale,
			opacity: .95,
		};

	
	});


	Plotly.d3.csv('../data/test_PCA_normalized.csv', function(err, rows){
		function unpack(rows, key) {
		  return rows[key]; ;
		}
		  
		var z_data=[];
		var y_data = [];
		var x_data = [];

		var all_z_data=[];
		var all_y_data = [];
		var all_x_data = [];

		var aml_z_data=[];
		var aml_y_data = [];
		var aml_x_data = [];

		//parse the rows of the csv file and write into above arrays
		for(i=0;i<rows.length;i++)
		{
		  var row = unpack(rows,i);
		  if (row['label'] == 'ALL') {
		  	all_x_data.push(parseFloat(row['x']));
			all_y_data.push(parseFloat(row['y']));
			all_z_data.push(parseFloat(row['z']));
		  } else {
		  	aml_x_data.push(parseFloat(row['x']));
			aml_y_data.push(parseFloat(row['y']));
			aml_z_data.push(parseFloat(row['z']));
		  }
		  x_data.push(parseFloat(row['x']));
		  y_data.push(parseFloat(row['y']));
		  z_data.push(parseFloat(row['z']));

		}

		test_aml = {
			x:aml_x_data, y: aml_y_data, z: aml_z_data,
			visible: bvalidation,
			showlegend: true,
			name:'test ALL set',

			mode: 'markers',
			marker: {
				symbol:'circle-open',
				size: 8,
				color: 'red',
				line: {
				color: 'rgba(0, 0, 0, 0.14)',
				width: 0.5},
				opacity: 0.9},
			type: 'scatter3d'
		};

		test_all = {
			x:all_x_data, y: all_y_data, z: all_z_data,
			visible: bvalidation,
			showlegend: true,
			name:'test AML set',

			mode: 'markers',
			marker: {
				symbol:'circle-open',
				size: 8,
				color: 'blue',
				line: {
				color: 'rgba(0, 0, 0, 0.14)',
				width: 0.5},
				opacity: 0.9},
			type: 'scatter3d'
		};

		


		data = [training_aml, training_all, test_aml, test_all, plane,parabola];
		layout = {
			showlegend:true
		}
		Plotly.newPlot('MLdata', data,layout);

	});
});


	function examplePlane() {
		example = document.getElementById('plane');

		
		
		var colorscale = [[0.0, 'rgb(51,181,229)'],
		[0.5, 'rgb(240,240,240)'],
	 	[1.0, 'rgb(51,181,229))']];

		z1 = [];
		var sample_points = 20;
		var intercept = 3
		for (var i = 0; i < sample_points; i++) {
			var next_z = []
			var xdisp = 10;
			var ydisp = 10;
			for (var j = 0; j < sample_points; j++) {
				// var rand_offset = Math.pow(Math.e, -(Math.pow((j-xdisp),2)/30 - (Math.pow((i-ydisp),2)/60));
				// console.log(rand_offset);
				var global_plane = i - j/4 + intercept;
				next_z.push(global_plane);
			}
			z1.push(next_z);
		}

		//Train set

		var sx = []
		var sy = []
		var sz = []

		var scatter_samples = 15;
		var max = 20;
		var min = 0;

		var z_min = 1;
		var z_max = 6;

		for (var i = 0; i < scatter_samples; i++) {
			var x = Math.random() * (max - min) + min;
			var y = Math.random() * (max - min) + min;
			var z = y - x/4 + intercept + (Math.random() * (z_max - z_min) + z_min);
			sx.push(x);
			sy.push(y);
			sz.push(z);
		}


		var sx2 = []
		var sy2 = []
		var sz2 = []
		for (var i = 0; i < scatter_samples; i++) {
			var x = Math.random() * (max - min) + min;
			var y = Math.random() * (max - min) + min;
			var z = y - x/4 + intercept - (Math.random() * (z_max - z_min) + z_min);;
			sx2.push(x);
			sy2.push(y);
			sz2.push(z);
		}
		

		var data_z1 = {
			z: z1, 
			name:"Decision Boundary",
			type: 'surface',
			colorscale: colorscale,
			opacity: .95
		};
		train_points = {
		x:sx, y: sy, z: sz,
		showlegend: false,

		name:'Training Set',
		mode: 'markers',
		marker: {
			symbol:'diamond-open',
			size: 8,
			color: "rgb(51,181,229)",
			opacity: 0.8},
		type: 'scatter3d'
		};
		train_points2 = {
			x:sx2, y: sy2, z: sz2,
			showlegend: false,
			name:'Training Set',
			mode: 'markers',
			marker: {
				size: 8,
				color: 'rgba(0,0,255,.9)',
				symbol:'diamond-open',
				opacity: .8
			},
			type: 'scatter3d'
		};

		//Test set

		var z_offsets = [1.1, 3.2, 2.3, 4.6, 2.8, 1.3, 3.1, 1.3, 2.2, 8.1];
		var x_vals = [5.1, 7.8, 8.5, 10.3, 12.7, 4.3, 3.2, 4.7, 14.2, 18.2];
		var y_vals = [6.8, 8.4, 3.3, 12.8, 14.4, 8.3, 1.3, 5.1, 4.31, 3.21];
		var tz = [];
		var tx = [];
		var ty = [];
		var scatter_samples = 10;

		for (var i = 0; i < scatter_samples / 2 - 1; i++) {
			var x = x_vals[i];
			var y = y_vals[i];
			var z = y - x/4 + intercept + z_offsets[i];
			tz.push(z);
			tx.push(x);
			ty.push(y);

		}

		var x = x_vals[scatter_samples/2 - 1];
		var y = y_vals[scatter_samples/2 - 1];
		var z = y - x/4 + intercept - z_offsets[i];
		tx.push(x);
		ty.push(y);
		tz.push(z);


		var tx2 = []
		var ty2 = []
		var tz2 = []
		for (var i = scatter_samples / 2; i < scatter_samples; i++) {
			var x = x_vals[i];
			var y = y_vals[i];
			var z = y - x/4 + intercept - z_offsets[i];
			tx2.push(x);
			ty2.push(y);
			tz2.push(z);
		}

		

	
		var test_points = {
		x:tx, y: ty, z: tz,
		showlegend: false,

		name:'Test Set',
		mode: 'markers',
		visible: false,
		marker: {
			symbol:'diamond',
			size: 8,
			color: "rgb(51,181,229)",
			opacity: 0.8},
		type: 'scatter3d'
		};
		test_points2 = {
			x:tx2, y: ty2, z: tz2,
			visible: false,
			showlegend: false,
			name:'Test Set',
			mode: 'markers',
			marker: {
				size: 8,
				color: 'rgba(0,0,255,.9)',
				line: {
				color: 'rgba(140, 140, 0, 0.14)',
				width: 0.5},
				opacity: 0.8},
			type: 'scatter3d'
		};


		Plotly.newPlot('plane', [data_z1, train_points, train_points2, test_points, test_points2]);
	}




	function exampleParabola() {
		example = document.getElementById('parabola');

		
		
		var colorscale = [[0.0, 'rgb(51,181,229)'],
		[0.5, 'rgb(240,240,240)'],
	 	[1.0, 'rgb(51,181,229))']];

		z1 = [];
		var sample_points = 20;
		for (var i = 0; i < sample_points; i++) {
			var next_z = []
			var xdisp = 10;
			var ydisp = 10;
			for (var j = 0; j < sample_points; j++) {
				// var rand_offset = Math.pow(Math.e, -(Math.pow((j-xdisp),2)/30 - (Math.pow((i-ydisp),2)/60));
				// console.log(rand_offset);
				var global_paraboloid = (((j - sample_points/2)/4) * ((j - sample_points/2)/4)) + (((i - sample_points/2)/3) * ((i - sample_points/2)/3));
				next_z.push(global_paraboloid);
			}
			z1.push(next_z);
		}

		//Training Set

		var sx = []
		var sy = []
		var sz = []

		var scatter_samples = 15;
		var max = 20;
		var min = 0;

		var z_min = 1;
		var z_max = 6;

		for (var i = 0; i < scatter_samples; i++) {
			var x = Math.random() * (max - min) + min;
			var y = Math.random() * (max - min) + min;
			var z = (((x - sample_points/2)/4) * ((x - sample_points/2)/4)) + (((y - sample_points/2)/3) * ((y - sample_points/2)/3)) 
				+ Math.random() * (z_max - z_min) + z_min;
			sx.push(x);
			sy.push(y);
			sz.push(z);
		}


		var sx2 = []
		var sy2 = []
		var sz2 = []
		for (var i = 0; i < scatter_samples; i++) {
			var x = Math.random() * (max - min) + min;
			var y = Math.random() * (max - min) + min;
			var z_rand = Math.random()
			var z = (((x - sample_points/2)/4) * ((x - sample_points/2)/4)) + (((y - sample_points/2)/3) * ((y - sample_points/2)/3)) 
				- (Math.random() * (z_max - z_min) + z_min);
			sx2.push(x);
			sy2.push(y);
			sz2.push(z);
		}
		

		var data_z1 = {
			z: z1, 
			name:"Decision Boundary",
			type: 'surface',
			colorscale: colorscale,
			opacity: .95,
		};
		train_points = {
		x:sx, y: sy, z: sz,
		showlegend: false,
		name:'Training Set 1',
		mode: 'markers',
		marker: {
			symbol:'circle-open',
			size: 8,
			color: 'red',
			opacity: 0.8},
		type: 'scatter3d'
		};
		train_points2 = {
			x:sx2, y: sy2, z: sz2,
			showlegend: true,
			name:'Training Set 2',
			mode: 'markers',
			marker: {
				symbol:'circle-open',
				size: 8,
				color: "rgb(51,181,229)",
			},
			type: 'scatter3d'
		};

		//Test set

		var z_offsets = [1.1, 3.2, 2.3, 4.6, 2.8, 1.3, 3.1, 1.3, 2.2, 8.1];
		var x_vals = [5.1, 7.8, 8.5, 10.3, 12.7, 4.3, 3.2, 4.7, 14.2, 18.2];
		var y_vals = [6.8, 8.4, 3.3, 12.8, 14.4, 8.3, 1.3, 5.1, 4.31, 3.21];
		var tz = [];
		var tx = [];
		var ty = [];
		var scatter_samples = 10;

		for (var i = 0; i < scatter_samples / 2; i++) {
			var x = x_vals[i];
			var y = y_vals[i];
			var z = (((x - sample_points/2)/4) * ((x - sample_points/2)/4)) + (((y - sample_points/2)/3) * ((y - sample_points/2)/3)) 
				+ z_offsets[i];
			tz.push(z);
			tx.push(x);
			ty.push(y);

		}


		var tx2 = []
		var ty2 = []
		var tz2 = []
		for (var i = scatter_samples / 2; i < scatter_samples - 1; i++) {
			var x = x_vals[i];
			var y = y_vals[i];
			var z = (((x - sample_points/2)/4) * ((x - sample_points/2)/4)) + (((y - sample_points/2)/3) * ((y - sample_points/2)/3)) 
				- z_offsets[i];
			tx2.push(x);
			ty2.push(y);
			tz2.push(z);
		}

		var x = x_vals[scatter_samples - 1];
		var y = y_vals[scatter_samples - 1];
		var z = (((x - sample_points/2)/4) * ((x - sample_points/2)/4)) + (((y - sample_points/2)/3) * ((y - sample_points/2)/3)) 
			+ z_offsets[i];
		tx2.push(x);
		ty2.push(y);
		tz2.push(z);

	
		var test_points = {
		x:tx, y: ty, z: tz,
		showlegend: true,
		visible: false,
		name:'Test Set 1',
		mode: 'markers',
		marker: {
			symbol:'diamond-open',
			size: 8,
			color: 'red',
			opacity: 0.8},
		type: 'scatter3d'
		};
		var test_points2 = {
			x:tx2, y: ty2, z: tz2,
			showlegend: true,
			visible: false,
			name:'Test Set 2',
			mode: 'markers',
			marker: {
				symbol:'diamond-open',
				size: 8,
				color: "rgb(51,181,229)",
				opacity: 0.8
			},
			type: 'scatter3d'
		};


		Plotly.newPlot('parabola', [data_z1, train_points, train_points2, test_points, test_points2]);

	}

	function parabolaVisibility() {

		bParabolaTest = !bParabolaTest;
		layout_test = {
			visible: bParabolaTest
		}
		layout_train = {
			visible: !bParabolaTest
		}

		Plotly.restyle('parabola', layout_train, 1);
		Plotly.restyle('parabola', layout_train, 2);
		Plotly.restyle('parabola', layout_test, 3);
		Plotly.restyle('parabola', layout_test, 4);


	}

	function planeVisibility() {

		bPlaneTest = !bPlaneTest;
		layout_test = {
			visible: bPlaneTest
		}
		layout_train = {
			visible: !bPlaneTest
		}

		Plotly.restyle('plane', layout_train, 1);
		Plotly.restyle('plane', layout_train, 2);
		Plotly.restyle('plane', layout_test, 3);
		Plotly.restyle('plane', layout_test, 4);


	}

	function MLShowParabola() {
		layout_parabola = {
			visible: true
		}
		layout_plane = {
			visible: false
		}

		Plotly.restyle('MLdata', layout_plane, 4);
		Plotly.restyle('MLdata', layout_parabola, 5);
	}

	function MLShowPlane() {
		layout_parabola = {
			visible: false
		}
		layout_plane = {
			visible: true
		}

		Plotly.restyle('MLdata', layout_plane, 4);
		Plotly.restyle('MLdata', layout_parabola, 5);
	}


	function MLHideBoundary() {
		layout_parabola = {
			visible: false
		}
		layout_plane = {
			visible: false
		}

		Plotly.restyle('MLdata', layout_plane, 4);
		Plotly.restyle('MLdata', layout_parabola, 5);
	}


	function hideValidation() {
		data = [training_all, training_aml,test_all,test_aml, plane];

		bvalidation = !bvalidation;
		layout = {
			visible: bvalidation,
			showlegend: true
		}

		Plotly.restyle('tester', layout, 1);

	}

	function hideBoundaries() {

		layout = {
			visible: false,
			showlegend: true
		}

		Plotly.restyle('tester', layout, 1);
	}
