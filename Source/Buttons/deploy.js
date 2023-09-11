const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');
const { getEmoji } = require('../elementHelpers');

const customId = "deploy";
module.exports = new Button(customId,
	/** Send the player a message with a select to pick an archetype */
	(interaction, args) => {
		const playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
		const classOptions = [];
		for (const className in playerProfile.archetypes) {
			if (playerProfile.archetypes[className] != null) {
				const archetype = getArchetype(className);
				classOptions.push({
					label: `${className} ${getEmoji(archetype.element)}`,
					description: `Gear: ${archetype.signatureEquipment.join(", ")}`,
					value: className
				})
			}
		}
		interaction.reply({
			content: `Select your archetype for this adventure!\n\nArchetypes can predict different information in combat and have different weaknesses and resistances based on their element.`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("archetype")
						.setPlaceholder("Select an archetype...")
						.addOptions(classOptions)
				)
			],
			ephemeral: true
		});
	}
);
