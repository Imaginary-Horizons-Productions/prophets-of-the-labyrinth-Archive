const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');

module.exports = new Button("deploy");

module.exports.execute = (interaction, args) => {
	// Start an adventure if clicked by adventure leader
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	let classOptions = [];
	for (const className in playerProfile.archetypes) {
		if (playerProfile.archetypes[className] > 0) {
			let archetype = getArchetype(className);
			classOptions.push({
				label: className,
				description: `${archetype.element} - ${archetype.predict}`,
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
	interaction.reply({ content: `Select your archetype for this adventure!`, components: archetypeSelect, ephemeral: true });
}
