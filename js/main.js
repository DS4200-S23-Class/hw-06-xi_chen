// define constant for frame and margin
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 60, right: 80, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;


// function that draw the three visualizations
function build_scatter() {
	d3.csv('data/iris.csv').then((data) => {

		// Add frame for the first visualization
		const FRAME1 = d3.select("#scatter_plot")
		.html("<h3> Petal_Length vs Sepal_Length <h3>")
		.append("svg")
		.attr("height", FRAME_HEIGHT)
		.attr("width", FRAME_WIDTH)
		.attr("class", "frame");

		// scale input x and y
		const MAX_X1 = d3.max(data, (d) => {
								return parseInt(d.Petal_Length);
							});
		const MAX_Y1 = d3.max(data, (d) => {
								return parseInt(d.Sepal_Length);
							});
		  
		// define color (used for all three visualization)
		const color = d3.scaleOrdinal()
		 					.domain(["setosa", "versicolor", "virginica"])
		 					.range(['orange', 'green', 'blue']);
		  
		//define couple of linear scales
		const xScale1 = d3.scaleLinear()
		 					.domain([0, MAX_X1 + 1]) //d3.extent captures the min. & max from a set of values
		   					.range([0, VIS_WIDTH]); // map the sepalLength values in dataset to full width of;
		const yScale1 = d3.scaleLinear()
						   .domain([0, MAX_Y1 + 1])  
						   .range([VIS_HEIGHT, 0]); // map the petalLength values in dataset to full height of svg
						  
		// draw the first visualization (scatter plot)
		var vis1 = FRAME1.selectAll("points")
			  	.data(data)
			  	.enter()
			  	.append('circle')
			  	// provide attributes to the points
				  	.attr('cx', (d) => {return (xScale1(d.Sepal_Length) + MARGINS.left);})
				  	.attr('cy', (d) => {return (yScale1(d.Petal_Length) + MARGINS.top);})
				  	.attr('r', 5)
				  	.attr('fill', (d) => {return color(d.Species);})
				  	.attr('opacity', 0.5);

		// add x-axis and y-axis to the scatter plot
		FRAME1.append("g")
				.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.bottom) + ")")
				.call(d3.axisBottom(xScale1));


		FRAME1.append("g")
				.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
				.call(d3.axisLeft(yScale1));


		// Add frame to the second visualization
		const FRAME2 = 
		d3.select("#scatter_plot_2")
			.html("<h3> Petal_Width vs Sepal_Width <h3>")
			.append("svg")
				.attr("height", FRAME_HEIGHT)
				.attr("width", FRAME_WIDTH)
				.attr("class", "frame");


		// scale input x and y
		const MAX_X2 = d3.max(data, (d) => {
								return parseInt(d.Sepal_Width);
							});
		const MAX_Y2 = d3.max(data, (d) => {
								return parseInt(d.Petal_Width);
							});
		  
		//define couple of linear scales
		const xScale2 = d3.scaleLinear()
		 					.domain([0, MAX_X2 + 1]) //d3.extent captures the min. & max from a set of values
		   					.range([0, VIS_WIDTH]); // map the sepalLength values in dataset to full width of;
		const yScale2 = d3.scaleLinear()
						   .domain([0, MAX_Y2 + 1])  
						   .range([VIS_HEIGHT, 0]); // map the petalLength values in dataset to full height of svg
	
		// attach the iris dataset to the second visualization (scatter plot)
		var vis2 = FRAME2.selectAll("points")
			  	.data(data)
			  	.enter()
			  	.append('circle')
			  	// provide attributes to our circles. 
				  	.attr('cx', (d) => {return (xScale2(d.Sepal_Width) + MARGINS.left);})
				  	.attr('cy', (d) => {return (yScale2(d.Petal_Width) + MARGINS.top);})
				  	.attr('r', 5)
				  	.attr('fill', (d) => {return color(d.Species);})
				  	.attr('opacity', 0.5);

		// add x-axis and y-axis to the scatter plot
		FRAME2.append("g")
				.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.bottom) + ")")
				.call(d3.axisBottom(xScale2));


		FRAME2.append("g")
				.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
				.call(d3.axisLeft(yScale2));

		// s is the set that used to record species that being selected
		const s = new Set()

		// Add brushing
		FRAME2.call( d3.brush()                     
        	  .extent( [ [0,0], [500,500] ] )
        	  .on("start brush", updateChart));

		// Function that is triggered when brushing is performed
		function updateChart(event) {
			console.log(s)
		    extent = event.selection
		    vis2.classed("selected", function(d){if(isBrushed(extent, xScale2(d.Sepal_Width), yScale2(d.Petal_Width), d.Species)) {
		   	s.add(d.Species)
		    }
		    return isBrushed(extent, xScale2(d.Sepal_Width), yScale2(d.Petal_Width), d.Species)});
		    vis1.classed("selected", function(d){ return isBrushed(extent, xScale2(d.Sepal_Width), yScale2(d.Petal_Width))})
		    vis3.classed("selected", function(d){ 
		    	return s.has(d.Species)})
		    s.clear() //empty the set so that it is usable for next event;
		};

		// A function that return TRUE or FALSE according if a dot is in the selection or not
		function isBrushed(brush_coords, cx, cy, speice) {
			let c_x = cx + MARGINS.left
		 	let c_y = cy + MARGINS.top
		    var x0 = brush_coords[0][0],
		        x1 = brush_coords[1][0],
		        y0 = brush_coords[0][1],
		        y1 = brush_coords[1][1];

		    	return x0 <= c_x && c_x <= x1 && y0 <= c_y && c_y <= y1
		  };


		// Add frame
		const FRAME3 = 
		d3.select("#bar_graph")
			.html("<h3> Count of Species</h3>")
			.append("svg")
				.attr("height", FRAME_HEIGHT)
				.attr("width", FRAME_WIDTH)
				.attr("class", "frame");


	    // hard code data
		const data_0 = [
		      { Species: "setosa", Amount: 50},
		      { Species: "versicolor", Amount: 50},
		      { Species: "virginica", Amount: 50},
		    ];

				  
		//define couple of linear scales
		const xScale3 = d3.scaleBand()
							.range ([0, VIS_WIDTH]).padding(0.1)
							.domain(data_0.map(function(d) { return d.Species; }));
		const yScale3 = d3.scaleLinear()
						    .domain([0, 50])  
						    .range([VIS_HEIGHT, 0]); // map the petalLength values in dataset to full height of svg
								  
		// add bar to bar chart
		vis3 = FRAME3.selectAll('bar_frame')
					 .data(data_0)
					 .enter()
						.append('rect')
							.attr('x', function(d) { return xScale3(d.Species) + MARGINS.left; })
							.attr('y', function(d) { return yScale3(d.Amount) + MARGINS.top; })
							.attr('width', xScale3.bandwidth())
							.attr('height', function(d) { return VIS_HEIGHT - yScale3(d.Amount); })
							.attr('fill', (d) => {return color(d.Species)})
							.attr('id', (d) => {return d.Species})
							.attr('fill-opacity', 0.5)
							.attr('class', 'bar');

		// add x-axis and y-axis
		FRAME3.append("g")
		        .attr("transform", 'translate(' + MARGINS.left +
					 	',' + (VIS_HEIGHT + MARGINS.top) + ')')
				.call(d3.axisBottom(xScale3))


		FRAME3.append("g")
		        .attr("transform", 'translate(' + MARGINS.left +
					 	',' + MARGINS.top + ')')
		        .call(d3.axisLeft(yScale3).tickFormat(function(d){
		             	return d;
		             }));


		});
};

build_scatter();