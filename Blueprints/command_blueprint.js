const Command = require('../../Classes/Command.js');

const id = "name";
const options = [
	{ type: "", name: "", description: "", required: false, choices: [] }
];
module.exports = new Command(id, "description", false, false, options);

module.exports.execute = (interaction) => {
	// Command specifications go here
}
