const Command = require('../../Classes/Command.js');

const options = [
	{ type: "", name: "", description: "", required: false, choices: {} }
];
module.exports = new Command("name", "description", false, false, options);

// imports from files that depend on /Config
// let ;
module.exports.initialize = function (isProduction) {
	if (isProduction) {
		({} = require("./../../helpers.js"));
	}
	return this;
}

module.exports.execute = (interaction) => {
	// Command specifications go here
}
