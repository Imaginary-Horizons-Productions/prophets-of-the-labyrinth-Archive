const Command = require('../../Classes/Command.js');
const { guildSetup } = require('../../helpers.js');

module.exports = new Command("reset", "Recreate the Dungeon Tamers category and central text channel and reset player scores", true, false);

module.exports.execute = (interaction) => {
	// Creates a new category and main text channel, storing the values in the guildDictionary
	guildSetup(interaction.guild);
	interaction.reply("The score wipe and reset of the Dungeon Tamers category and central text channel has begun.")
}
