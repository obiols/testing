define("graph", ["d3", "device"], function(d3) {

	function Graph(csv, backColor, frontColor) {
		this.svg = undefined;
		this.g = undefined;

		this.width = 640,
		this.height = 1080;
		this.backColor = backColor;
		this.frontColor = frontColor;

		this.title = undefined;

		this.label1 = undefined;
		this.label2 = undefined;

		this.value1 = undefined;
		this.value2 = undefined;

		this.percent1 = undefined;
		this.percent2 = undefined;

		this.csv = csv;

	}

	Graph.prototype.INNER_RADIUS = 220;
	Graph.prototype.OUTER_RADIUS = 240;

	Graph.prototype.init = function() {
		this.setupData();

		this.createSVG();
		this.createCircles();
		this.addTitle();
		this.addTotal();
		this.setSmallGraph(this.g);
		this.addLabels();
		this.addSeparator();
	};


	Graph.prototype.setTitle = function (title) {
		this.title = title;
	};

	Graph.prototype.setLabel1 = function(label) {
		this.label1 = label;
	};

	Graph.prototype.setValue1 = function(value) {
		this.value1 = value;
	};

	Graph.prototype.setLabel2 = function(label) {
		this.label2 = label;
	};

	Graph.prototype.setValue2 = function(value) {
		this.value2 = value;
	};

	Graph.prototype.setupData = function () {
		this.total = this.value1 + this.value2;
		this.percent1 = this.value1 * 100 / this.total;
		this.percent2 = this.value2 * 100 / this.total;
	};

	Graph.prototype.createSVG = function() {
		this.svg = d3.select("body").append("svg")
			.attr("width", this.width)
			.attr("height", this.height)
				.style("margin-left", 150);

		this.g = this.svg.append("g")
			.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")"); 
	};

	Graph.prototype.createCircles = function() {
		var arc = d3.arc()
			.innerRadius(this.INNER_RADIUS)
			.outerRadius(this.OUTER_RADIUS)
			.startAngle(0);

		var circleBack = this.g.append("path")
			.datum({endAngle: (2 * Math.PI)})
				.style("fill", this.backColor)
			.attr("d", arc);

		var circleFront = this.g.append("path")
			.datum({endAngle: (2 * Math.PI * this.percent1/100)})
				.style("fill", this.frontColor)
			.attr("d", arc);
	};

	Graph.prototype.addTitle = function() {
		this.g.append("text")
			.attr("transform", "translate(0, -55)")
				.style("font-family", "Roboto, sans-serif, Arial")
				.style("font-size", 45)
				.style("fill", "rgb(169, 169, 169)")
				.style("text-anchor", "middle")
			.text(this.title);
	};

	Graph.prototype.addTotal = function() {
		var total = this.value1 + this.value2;
		this.g.append("text")
			.attr("transform", "translate(0, 10)")
				.style("font-family", "Roboto, sans-serif, Arial")
				.style("font-size", 60)
				.style("font-weight", "bold")
				.style("fill", "rgb(25, 25, 25)")
				.style("text-anchor", "middle")
			.text(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€");
	};


	Graph.prototype.setSmallGraph = function() {
		var parseTime = d3.timeParse("%d-%b-%y");
		
		var g = this.g;
		var backColor = this.backColor;

		var x = d3.scaleTime().range([0, this.INNER_RADIUS * 2]),
			y = d3.scaleLinear().range([this.INNER_RADIUS, 0]);			

		var area = d3.area()
			.x(function(d) { return x(d.date); })
			.y0(this.INNER_RADIUS)
			.y1(function(d) { return y(d.close); });

		var line = d3.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.close); });

		d3.csv(this.csv, function(error, data) {
			if (error) throw error;

			data.forEach(function(d) {
				d.date = parseTime(d.date);
				d.close = +d.close;
			});

			x.domain(d3.extent(data, function(d) { return d.date; }));
			y.domain([0, d3.max(data, function(d) { return d.close; })]);

			
			g.append("svg:clipPath")
				.attr("id", "clip")
				.append("svg:circle")
				.attr("id", "clip-rect")
				.attr("transform", "translate(0, -30)")
				.attr("cx", 220)
				.attr("r", 200);

			g.append("path")
				.data([data])
				.attr("class", "area")
				.attr("transform", "translate(-220, 30)")
				.attr("clip-path", "url(#clip)")
				.attr("d", area)
					.style("fill", backColor)
					.style("opacity", "0.2");

			g.append("path")
				.data([data])
				.attr("class", "line")
				.attr("transform", "translate(-220, 30)")
				.attr("clip-path", "url(#clip)")
				.attr("d", line)
					.style("fill", "none")
					.style("stroke", backColor)
					.style("stroke-width", "4px");
		});
	};



	Graph.prototype.addLabels = function () {
		var label_1 = this.svg.append("text")
			.attr("transform", "translate(0, 800)")
			.attr("text-anchor", "start")
				.style("font-family", "Droid Sans")
				.style("font-size", 30)
				.style("font-weight", "bold")
				.style("fill", this.backColor)
			.text(this.label1);

		var percent_1 = this.svg.append("text")
			.attr("transform", "translate(0, 850)")
			.attr("text-anchor", "start")
				.style("font-family", "Roboto")
				.style("font-size", 30)
				.style("fill", "black")
			.text(this.percent1 + "%");

		var revenue_1 = this.svg.append("text")
			.attr("transform", "translate(80, 850)")
			.attr("text-anchor", "start")
				.style("font-family", "Roboto")
				.style("font-size", 30)
				.style("fill", "rgb(169, 169, 169)")
			.text(this.value1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€");
		/*----------------------------------------------*/ 
		var label_2 = this.svg.append("text")
			.attr("transform", "translate(" + this.width + ", 800)")
			.attr("text-anchor", "end")
				.style("font-family", "Droid Sans")
				.style("font-size", 30)
				.style("font-weight", "bold")
				.style("fill", this.frontColor)
			.text(this.label2);

		var percent_2 = this.svg.append("text")
		.attr("transform", "translate(" + (this.width - 200) + ", 850)")
		.attr("text-anchor", "end")
			.style("font-family", "Roboto")
			.style("font-size", 30)
			.style("fill", "black")
		.text(this.percent2 + "%");

		var revenue_2 = this.svg.append("text")
			.attr("transform", "translate(" + this.width + ", 850)")
			.attr("text-anchor", "end")
				.style("font-family", "Roboto")
				.style("font-size", 30)
				.style("fill", "rgb(169, 169, 169)")
			.text(this.value2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€");
	};

	Graph.prototype.addSeparator = function() {
		var lineGenerator = d3.line();
		var line = lineGenerator([[0,0],[this.width,0]]);
		var divider = this.svg.append("path")
			.attr("transform", "translate(0, " + (this.height-200) + ")")
			.attr("text-anchor", "end")
				.style("stroke", "rgb(200, 200, 200)")
				.style("stroke-width", "4")
			.attr("d", line);
	};

	return Graph;
});