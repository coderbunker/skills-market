var counter = 0;

module.exports = {

	get: function() {
		return counter;
	},
    
	reset: function reset() {
		counter = 0;
	},

	add: function add() {
		counter++;
	}
}