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
		    showscale: false,
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
		var para_points = 500.0;

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

		bvalidation = !bvalidation;
		layout_train = {
			visible: !bvalidation,
			showlegend: true
		}

		layout_test = {
			visible: bvalidation,
			showlegend: true
		}

		Plotly.restyle('MLdata', layout_train, 0);
		Plotly.restyle('MLdata', layout_train, 1);
		Plotly.restyle('MLdata', layout_test, 2);
		Plotly.restyle('MLdata', layout_test, 3);


	}
