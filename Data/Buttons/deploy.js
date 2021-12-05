const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');

module.exports = new Button("deploy");

module.exports.execute = (interaction, args) => {
	// Send the player a message with a select to pick an archetype
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id); //TODO if player hasn't joined adventure, allow them to join
	let classOptions = [];
	for (const className in playerProfile.archetypes) {
		if (playerProfile.archetypes[className] > 0) {
			let archetype = getArchetype(className);
			classOptions.push({
				label: `${className}`,
				description: `Predicts: ${archetype.predict} ~-~-~ Element: ${archetype.element}`,
				value: className
			})
		}
	}
	let archetypeSelect = [new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId("archetype")
				.setPlaceholder("Select an archetype...")
				.addOptions(classOptions),
		)
	];
	interaction.reply({ content: `Select your archetype for this adventure!\n\nArchetypes can predict different information in combat and have different weaknesses and resistances based on their element.`, components: archetypeSelect, ephemeral: true });
}
