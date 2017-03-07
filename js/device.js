define("device", function() {

	function Device(data) {
		this.type = data["type"];
		this.revenue = data["revenue"];
		this.impresions = data["impresions"];
		this.visits = data["visits"];
	}

	Device.prototype.getRevenue = function() {
		return this.revenue;
	};

	Device.prototype.getImpresions = function() {
		return this.impresions;
	};

	Device.prototype.getVisits = function() {
		return this.visits;
	};

	Device.prototype.getType = function() {
		return this.type;
	};

	return Device;
});