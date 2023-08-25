const Select = require('../../Classes/Select.js');
const { getPlayer, setPlayer } = require('../playerDAO.js');

const id = "collectartifact";
module.exports = new Select(id, (interaction, args) => {
	// Add the selected artifact to the player's profile
	const [artifactName] = interaction.values;
	const player = getPlayer(interaction.user.id, interaction.guildId);
	player.artifacts[interaction.channelId] = artifactName;
	setPlayer(player);
	interaction.reply({ content: `You decide to hold onto a ${artifactName}. You'll be able to bring it on future adventures.`, ephemeral: true });
});
