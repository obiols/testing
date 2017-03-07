define("controller", ["device", "graph"], function(Device, Graph) {

	function Controller(data) {
		this.data = data;
	}

	Controller.prototype.getResourceFromAPI = function(url) {
		var oReq = new XMLHttpRequest();
		oReq.onload = this.createView;
		oReq.open("get", "./js/data/device1.json", true);
		oReq.send();

		var jsonData;
		function reqListener () {
			jsonData = JSON.parse(this.responseText);
			console.log(jsonData);
			//new Device(jsonData);
			this.createView();
		};
	};

	Controller.prototype.createView = function() {

			var data = JSON.parse(this.responseText);
			var dev1 = new Device(data["devices"][0]),
				dev2 = new Device(data["devices"][1]);

			var graph1 = new Graph("js/data/data1.csv", "rgb(81, 216, 41)", "rgb(19, 108, 3)");
			graph1.setTitle("REVENUE");
        	graph1.setLabel1(dev1.getType());
			graph1.setValue1(dev1.getRevenue());
        	graph1.setLabel2(dev2.getType());
        	graph1.setValue2(dev2.getRevenue());
			graph1.init();

			var graph2 = new Graph("js/data/data2.csv", "rgb(252, 196, 0)", "rgb(218, 95, 44)");
			graph2.setTitle("VISITS");
			graph2.setLabel1(dev1.getType());
			graph2.setValue1(dev1.getVisits());
			graph2.setLabel2(dev2.getType());
			graph2.setValue2(dev2.getVisits());
			graph2.init();

			var graph3 = new Graph("js/data/data3.csv", "rgb(0,206,224)", "rgb(0, 80, 98)");
			graph3.setTitle("IMPRESIONS");
			graph3.setLabel1(dev1.getType());
			graph3.setValue1(dev1.getImpresions());
			graph3.setLabel2(dev2.getType());
			graph3.setValue2(dev2.getImpresions());
			graph3.init();
	};

	return Controller;
});