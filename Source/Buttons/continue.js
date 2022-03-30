const { nextRoom, getAdventure } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { SAFE_DELIMITER } = require('../../helpers.js');

module.exports = new Button("continue");

module.exports.execute = (interaction, args) => {
	// Generate the next room of an adventure
	let adventure = getAdventure(interaction.channel.id);
	if (interaction.user.id === adventure.leaderId) {
		// Disable all other components
		interaction.update({
			components: [...interaction.message.components.map(row => {
				return new MessageActionRow().addComponents(...row.components.map(component => {
					if (component.customId !== "continue") {
						let editedComponent = component.setDisabled(true);
						if (component instanceof MessageButton && !component.emoji) {
							editedComponent.setEmoji("✖️");
						}
						return editedComponent;
					} else {
						let continueButton = component.setDisabled(true)
							.setEmoji("✔️");
						return continueButton;
					}
				}));
			})
			]
		}).then(() => {
			let [roomType, _depth] = Object.keys(adventure.roomCandidates)[0].split(SAFE_DELIMITER);
			nextRoom(roomType, adventure, interaction.channel);
		})
	} else {
		interaction.reply({ content: "Please wait for the leader to move to the next room.", ephemeral: true });
	}
}
