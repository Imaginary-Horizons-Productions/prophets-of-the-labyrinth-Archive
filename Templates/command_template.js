const Command = require('../../Classes/Command.js');

const options = [
	{ type: "", name: "", description: "", required: false, choices: {} }
];
module.exports = new Command("name", "description", false, false, options);

// imports from files that depend on /Config
// let ;
module.exports.initialize = function (helpers) {
	({} = helpers);
}

module.exports.execute = (interaction) => {
	// Command specifications go here
}
