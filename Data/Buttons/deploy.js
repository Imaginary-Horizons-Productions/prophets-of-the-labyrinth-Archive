const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');
const { characterDictionary } = require('../Characters/_characterDictionary.js');

module.exports = new Button("deploy");

module.exports.execute = (interaction, args) => {
	// Start an adventure if clicked by adventure leader
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	let classOptions = [];
	for (const className in playerProfile.characters) {
		if (playerProfile.characters[className] > 0) {
			let character = characterDictionary[className];
			classOptions.push({
				label: className,
				description: `${character.element} - ${character.read}`,
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
