const { getAdventure, endRoom } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { SAFE_DELIMITER } = require('../../constants.js');

const id = "continue";
module.exports = new Button(id, (interaction, args) => {
	// Generate the next room of an adventure
	let adventure = getAdventure(interaction.channel.id);
	if (interaction.user.id === adventure.leaderId) {
		// Disable all other components
		interaction.update({
			components: [...interaction.message.components.map(row => {
				return new ActionRowBuilder().addComponents(...row.components.map(component => {
					if (component.customId !== id) {
						let editedComponent = component.setDisabled(true);
						if (component instanceof ButtonBuilder && !component.emoji) {
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
			endRoom(roomType, interaction.channel);
		})
	} else {
		interaction.reply({ content: "Please wait for the leader to move to the next room.", ephemeral: true });
	}
});
