const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');
const { getEmoji } = require('../elementHelpers');

const id = "deploy";
module.exports = new Button(id, (interaction, args) => {
	// Send the player a message with a select to pick an archetype
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
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
});
