const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { delverStatsBuilder } = require('../combatantDAO.js');

module.exports = new Button("inspectself");

module.exports.execute = (interaction, args) => {
	// Provide the player their combat stats
	const adventure = getAdventure(interaction.channel.id);
	if (adventure) {
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (delver) {
			interaction.reply(delverStatsBuilder(delver))
				.catch(console.error);
		} else {
			interaction.reply({ content: "You are not a part of this adventure.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
	}
}
