const Command = require('../../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { completeAdventure, getAdventure } = require('../adventureDAO.js');

const options = [];
module.exports = new Command("give-up", "Lets the adventure leader end the adventure", false, false, options);

// imports from files that depend on /Config
// let ;
module.exports.initialize = function () {
	({} = require("./../../helpers.js"));
}

module.exports.execute = (interaction) => {
	// Give up on the current adventure
	const adventure = getAdventure(interaction.channel.id);
	if (adventure && adventure.state !== "completed") {
		if (interaction.user.id === adventure.leaderId) {
			completeAdventure(adventure, interaction.channel, new MessageEmbed().setTitle("Defeat"));
			interaction.reply({ content: "Give up completed.", ephemeral: true });
		} else {
			interaction.reply({ content: "Please ask the leader to end the adventure.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", ephemeral: true });
	}
}
