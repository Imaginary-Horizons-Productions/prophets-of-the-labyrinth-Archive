const Command = require('../../Classes/Command.js');

var command = new Command("name", "description", false, false);

command.execute = (interaction) => {
	// Command specifications go here
}

module.exports = command;
