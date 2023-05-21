const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getPlayer } = require('../playerDAO.js');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');
const { getAdventure } = require('../adventureDAO.js');
const { getEmoji } = require('../elementHelpers');

const id = "deploy";
module.exports = new Button(id, (interaction, args) => {
	// Send the player a message with a select to pick an archetype
	let adventure = getAdventure(interaction.channel.id);
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	let user = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (user) {
		let classOptions = [];
		for (const className in playerProfile.archetypes) {
			if (playerProfile.archetypes[className] > 0) {
				let archetype = getArchetype(className);
				classOptions.push({
					label: `${className} ${getEmoji(archetype.element)}`,
					description: `Predicts: ${archetype.predict}`,
					value: className
				})
			}
		}
		let archetypeSelect = [new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId("archetype")
				.setPlaceholder("Select an archetype...")
				.addOptions(classOptions)
		)];
		interaction.reply({ content: `Select your archetype for this adventure!\n\nArchetypes can predict different information in combat and have different weaknesses and resistances based on their element.`, components: archetypeSelect, ephemeral: true });
	} else {
		let join = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}aux`)
				.setLabel("Join")
				.setStyle(ButtonStyle.Success));
		interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
	}
});
