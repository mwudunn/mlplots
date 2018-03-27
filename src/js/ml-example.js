$( document ).ready(function() {
	MLdata = document.getElementById('MLdata');
	bvalidation = true;
	bPlaneTest = false;
	bParabolaTest = false;

	var training_all = {};
	var training_aml = {};
	var parabola = {};
	var plane = {}; 

	examplePlane();
	exampleParabola();
	

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
			showscale: false,
			opacity: .95
		};
		train_points = {
			x:sx, y: sy, z: sz,
			showlegend: true,
			showscale: false,
			name:'Training Set AML',
			mode: 'markers',
			marker: {
				symbol:'circle-open',
				size: 8,
				color: "rgb(51,181,229)",
				opacity: 0.8},
			type: 'scatter3d'
		};
		train_points2 = {
			x:sx2, y: sy2, z: sz2,
			showlegend: true,
			showscale: false,
			name:'Training Set ALL',
			mode: 'markers',
			marker: {
				size: 8,
				color: 'rgba(0,0,255,.9)',
				symbol:'circle-open',
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
			showlegend: true,
			name:'Test Set ALL',
			mode: 'markers',
			visible: false,
			showscale: false, 
			marker: {
				symbol:'diamond-open',
				size: 8,
				color: "rgb(51,181,229)",
				opacity: 0.8},
			type: 'scatter3d'
		};
		test_points2 = {
			x:tx2, y: ty2, z: tz2,
			visible: false,
			showlegend: true,
			showscale: false,
			name:'Test Set AML',
			mode: 'markers',
			marker: {
				size: 8,
				symbol:'diamond-open',
				color: 'rgba(0,0,255,.9)',
				opacity: 0.8},
			type: 'scatter3d'
		};


		Plotly.newPlot('plane', [data_z1, train_points, train_points2, test_points, test_points2], 
			{autosize: true,margin: {
			t: 20, //top margin
			l: 20, //left margin
			r: 20, //right margin
			b: 20 //bottom margin
			}
			}
		);
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
			showscale: false,
			colorscale: colorscale,
			opacity: .95,

		};
		train_points = {
		x:sx, y: sy, z: sz,
		showlegend: true,
		showscale: false,
		name:'Training Set ALL',
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
			showscale: false,
			name:'Training Set AML',
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
		showscale: false,
		visible: false,
		name:'Test Set ALL',
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
			showscale: false,
			visible: false,
			name:'Test Set AML',
			mode: 'markers',
			marker: {
				symbol:'diamond-open',
				size: 8,
				color: "rgb(51,181,229)",
				opacity: 0.8
			},
			type: 'scatter3d'
		};


		Plotly.newPlot('parabola', [data_z1, train_points, train_points2, test_points, test_points2], {autosize: true,margin: {
			t: 20, //top margin
			l: 20, //left margin
			r: 20, //right margin
			b: 20 //bottom margin
			}
			}
			// {
			//   paper_bgcolor: 'rgba(0,0,0,0)',
			//   plot_bgcolor: 'rgba(0,0,0,0)'
			// }
			);

	}

	function parabolaVisibility() {

		bParabolaTest = !bParabolaTest;
		layout_test = {
			visible: bParabolaTest,
			autosize: true
		}
		layout_train = {
			visible: !bParabolaTest,
			autosize: true
		}

		Plotly.restyle('parabola', layout_train, 1);
		Plotly.restyle('parabola', layout_train, 2);
		Plotly.restyle('parabola', layout_test, 3);
		Plotly.restyle('parabola', layout_test, 4);


	}

	function planeVisibility() {

		bPlaneTest = !bPlaneTest;
		layout_test = {
			visible: bPlaneTest,
			autosize: true
		}
		layout_train = {
			visible: !bPlaneTest,
			autosize: true
		}

		Plotly.restyle('plane', layout_train, 1);
		Plotly.restyle('plane', layout_train, 2);
		Plotly.restyle('plane', layout_test, 3);
		Plotly.restyle('plane', layout_test, 4);


	}

	function MLShowParabola() {
		layout_parabola = {
			visible: true,
			autosize: true
		}
		layout_plane = {
			visible: false,
			autosize: true
		}

		Plotly.restyle('MLdata', layout_plane, 4);
		Plotly.restyle('MLdata', layout_parabola, 5);
	}

	function MLShowPlane() {
		layout_parabola = {
			visible: false,
			autosize: true
		}
		layout_plane = {
			visible: true,
			autosize: true,
			showlegend: true
		}

		Plotly.restyle('MLdata', layout_plane, 4);
		Plotly.restyle('MLdata', layout_parabola, 5);
	}


	function MLHideBoundary() {
		layout_parabola = {
			visible: false,
			autosize: true
		}
		layout_plane = {
			visible: false,
			autosize: true
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
