
	TESTER = document.getElementById('tester');
	bvalidation = true;
	var train = {};
	var validation = {};
	var plane = {}; 

	Plotly.d3.csv('Archive/train_PCA_all.csv', function(err, rows){

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
			size: 12,
			line: {
			color: 'rgba(0, 0, 0, 0.14)',
			width: 0.5},
			opacity: 0.8},
		type: 'scatter3d'
	};

	plane = {
		x:xx, y:yy, z:zz,
		mode: 'markers',
		name: 'Decision Boundary',
		marker: {
			size: 12,
			line: {
			color: 'rgba(0, 0, 0, 0.14)',
			width: 0.5},
			opacity: 0.8},
		type: 'surface'
	}	  
	
	});


	Plotly.d3.csv('Archive/train_PCA_aml.csv', function(err, rows){

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
			size: 12,
			line: {
			color: 'rgba(217, 0, 0, 0.14)',
			width: 0.5},
			opacity: 0.8},
		type: 'scatter3d'
	};


	data = [all, aml, plane];
	Plotly.newPlot('tester', data);

	});

	function nonconvexDataspace() {
		example = document.getElementById('example');

		var max = 100;
		var min = -100;
		z1 = [];
		var sample_points = 300;
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
		

		var data_z1 = {z: z1, type: 'surface'};
		Plotly.newPlot('example', [data_z1]);

	}


	function hideValidation() {
		data = [train, validation, plane];

		bvalidation = !bvalidation;
		layout = {
			visible: bvalidation
		}

		Plotly.restyle('tester', layout, 1);

	}