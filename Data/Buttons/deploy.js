const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');

module.exports = new Button("deploy");

module.exports.execute = (interaction, args) => {
	// Start an adventure if clicked by adventure leader
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	let classOptions = [];
	for (const className in playerProfile.characters) {
		if (playerProfile.characters[className] > 0) {
			classOptions.push({
				label: className,
				description: "", //TODO element, readtype or description in deploy
				value: className
			})
		}
	}
	let characterSelect = [new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId("delver")
				.setPlaceholder("Select a class...")
				.addOptions(classOptions),
		)
	];
	interaction.reply({ content: `Select your class for this adventure!`, components: characterSelect, ephemeral: true });
}
