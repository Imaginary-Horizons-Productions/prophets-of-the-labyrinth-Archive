const { getAdventure, endRoom } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, ComponentType, StringSelectMenuBuilder, ButtonBuilder } = require('discord.js');
const { SAFE_DELIMITER } = require('../../constants.js');

const id = "continue";
module.exports = new Button(id, (interaction, args) => {
	// Generate the next room of an adventure
	const adventure = getAdventure(interaction.channel.id);
	if (interaction.user.id === adventure.leaderId) {
		// Disable all other components
		interaction.update({
			components: interaction.message.components.map(row => {
				return new ActionRowBuilder().addComponents(row.components.map(({ data: component }) => {
					switch (component.type) {
						case ComponentType.Button:
							const updatedButton = new ButtonBuilder(component).setDisabled(true);
							if (component.custom_id === id) {
								updatedButton.setEmoji("✔️");
							} else if (!component.emoji) {
								updatedButton.setEmoji("✖️");
							}

							return updatedButton;
						case ComponentType.StringSelect:
							return new StringSelectMenuBuilder(component).setDisabled(true);
						default:
							throw new Error(`Disabling unregistered component from continue button: ${component.type}`);
					}
				}));
			})
		}).then(() => {
			const [roomType, _depth] = Object.keys(adventure.roomCandidates)[0].split(SAFE_DELIMITER);
			endRoom(roomType, interaction.channel);
		})
	} else {
		interaction.reply({ content: "Please wait for the leader to move to the next room.", ephemeral: true });
	}
});
