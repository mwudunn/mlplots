
	TESTER = document.getElementById('tester');
	bvalidation = true;
	bPlaneTest = false;
	bParabolaTest = false;

	var train = {};
	var validation = {};
	var plane = {}; 

	Plotly.d3.csv('../data/train_PCA_all.csv', function(err, rows){

	function unpack(rows, key) {
	  return rows[key]; ;
	}
	  
	var z_data=[];
	var y_data = [];
	var x_data = [];

	//parse the rows of the csv file and write into above arrays
	for(i=0;i<rows.length;i++)
	{
	  var row = unpack(rows,i);
	  x_data.push(parseFloat(row['x']));
	  y_data.push(parseFloat(row['y']));
	  z_data.push(parseFloat(row['z']));

	}

	//initialize equations
	x_eq = parseFloat('1.55937729e-05');
	y_eq = parseFloat('-2.27575413e-05');
	z_eq = parseFloat('-1.45547286e-06');
	intercept = parseFloat('-0.421052631579');

	var min_x_data = Math.min.apply(Math, x_data);
	var max_x_data = Math.max.apply(Math, x_data);
	var min_y_data = Math.min.apply(Math, y_data);
	var max_y_data = Math.max.apply(Math, y_data);
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


	//calculate the meshgrid of x and y
	var xx = [];
	var yy = [];
	var zz = [];

	for (var j = 0; j < y.length; j++) {
		var next_arr_x = [];
		var next_arr_y = [];
		for (var i = 0; i < x.length; i++) {
			next_arr_x.push(x[i]);
			next_arr_y.push(y[j]);
		}
		xx.push(next_arr_x);
		yy.push(next_arr_y);
	}

	//calculate z
	for (var j = 0; j < y.length; j++) {
		var next_arr_z = [];
		for (var i = 0; i < x.length; i++) {
			var next_z = (intercept - xx[j][i] * x_eq - yy[j][i] * y_eq) / z_eq;
			next_arr_z.push(next_z);
		}
		zz.push(next_arr_z);
	}


	all = {
		x:x_data, y: y_data, z: z_data,
		visible: bvalidation,
		showlegend: false,
		name:'ALL set',
		mode: 'markers',
		
		marker: {
			size: 8,
			symbol:'diamond-open',
			color: "rgb(51,181,229)",
			},
		type: 'scatter3d'
	};

	var colorscale = [[0.0, 'rgb(51,181,229)'],
		[0.5, 'rgb(240,240,240)'],
	 	[1.0, 'rgb(51,181,229))']];


	plane = {
		x:xx, 
		y:yy, 
		z:zz,
		
	    colorscale: colorscale,
	    
		name: 'Decision Boundary',
		type: 'surface',
		opacity: .7
	}	  
	
	});


	Plotly.d3.csv('../data/train_PCA_aml.csv', function(err, rows){

	function unpack(rows, key) {
	  return rows[key]; ;
	}
	  
	var z_data=[];
	var y_data = [];
	var x_data = [];

	//parse the rows of the csv file and write into above arrays
	for(i=0;i<rows.length;i++)
	{
	  var row = unpack(rows,i);
	  x_data.push(parseFloat(row['x']));
	  y_data.push(parseFloat(row['y']));
	  z_data.push(parseFloat(row['z']));

	}

	aml = {
		x:x_data, y: y_data, z: z_data,
		visible: bvalidation,
		showlegend: false,
		name:'AML set',

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


	data = [all, aml, plane];
	Plotly.newPlot('tester', data);

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
		data_points = {
		x:sx, y: sy, z: sz,
		showlegend: false,

		name:'Points Defining the Decision Boundary',
		mode: 'markers',
		marker: {
			symbol:'diamond',
			size: 8,
			color: "rgb(51,181,229)",
			opacity: 0.8},
		type: 'scatter3d'
	};
		data_points2 = {
			x:sx2, y: sy2, z: sz2,
			showlegend: false,
			name:'Training Set',
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
		Plotly.newPlot('plane', [data_z1, data_points, data_points2]);
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
			opacity: .7,
		};
		train_points = {
		x:sx, y: sy, z: sz,
		showlegend: false,
		name:'Scatter Set 1',
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
			showlegend: false,
			name:'Scatter Set 2',
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
		showlegend: false,
		visible: false,
		name:'Test Set',
		mode: 'markers',
		marker: {
			size: 8,
			symbol:'diamond',
			color: 'rgba(0,255,0,.9)',
			line: {
			color: 'rgba(0, 0, 0, 0.14)',
			width: 0.5},
			opacity: 0.8},
		type: 'scatter3d'
		};
		var test_points2 = {
			x:tx2, y: ty2, z: tz2,
			showlegend: false,
			visible: false,
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


	function hideValidation() {
		data = [train, validation, plane];

		bvalidation = !bvalidation;
		layout = {
			visible: bvalidation
		}

		Plotly.restyle('tester', layout, 1);

	}