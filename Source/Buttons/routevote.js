const { nextRoom, getAdventure } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { clearComponents } = require('../../helpers.js');

module.exports = new Button("routevote");

module.exports.execute = (interaction, [direction]) => {
	// Tally votes for next room
	let adventure = getAdventure(interaction.channel.id);
	let delverIds = adventure.delvers.map(delver => delver.id);
	if (delverIds.includes(interaction.user.id)) {
		let changeVote = false;
		for (const roomType in adventure.roomCandidates) {
			if (adventure.roomCandidates[roomType].includes(interaction.user.id)) {
				changeVote = true;
				adventure.roomCandidates[roomType] = adventure.roomCandidates[roomType].filter(id => id !== interaction.user.id);
			}
		}
		adventure.roomCandidates[direction].push(interaction.user.id);

		interaction.reply(`${interaction.user} ${changeVote ? "changed their vote to" : "voted for"} ${direction}.`).then(() => {
			// Decide by unanimous vote
			if (adventure.roomCandidates[direction].length === adventure.delvers.length) {
				clearComponents(adventure.messageIds.battleRound, interaction.channel.messages);
				let uiRows = [...interaction.message.components.map(row => {
					return new MessageActionRow().addComponents(...row.components.map(component => {
						let editedComponent = component.setDisabled(true);
						if (component.customId === `routevote-${direction}`) {
							editedComponent.setEmoji("✔️");
						} else {
							if (component instanceof MessageButton && !component.emoji?.name) {
								editedComponent.setEmoji("✖️");
							}
						}
						return editedComponent;
					}));
				})];
				interaction.message.edit({ components: uiRows });
				interaction.followUp(`The party moves on to ${direction}.`).then(message => {
					nextRoom(direction, adventure, interaction.channel);
				});
			}
		});
	} else {
		interaction.reply({ content: "Please vote on routes in adventures you've joined.", ephemeral: true });
	}
}
