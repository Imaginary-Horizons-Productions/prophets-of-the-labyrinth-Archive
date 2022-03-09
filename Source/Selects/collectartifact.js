const Select = require('../../Classes/Select.js');
const { getPlayer, setPlayer } = require('../playerDAO.js');

module.exports = new Select("collectartifact");

module.exports.execute = (interaction, _args) => {
	// Add the selected artifact to the player's profile
	let [artifactName] = interaction.values;
	let player = getPlayer(interaction.user.id, interaction.guildId);
	player.artifacts[interaction.channelId] = artifactName;
	setPlayer(player);
	interaction.reply({ content: `You decide to hold onto a ${artifactName}. You'll be able to bring it on future adventures.`, ephemeral: true });
}
