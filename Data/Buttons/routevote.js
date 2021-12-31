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

		// Update votes tally
		let allVotes = [].concat(...Object.values(adventure.roomCandidates));
		let notVoted = delverIds.filter(id => !allVotes.includes(id));
		let routingText = "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.";
		if (notVoted.length) {
			routingText += `\n\nUndecided:\n<@${notVoted.join(">, <@")}>`
		}
		for (const roomType in adventure.roomCandidates) {
			if (adventure.roomCandidates[roomType].length) {
				routingText += `\n\n${roomType}:\n<@${adventure.roomCandidates[roomType].join(">, <@")}>`;
			}
		}

		let embed = interaction.message.embeds[0];
		embed.spliceFields(embed.fields.findIndex(field => field.name === "Decide the next room"), 1, { name: "Decide the next room", value: routingText });
		interaction.message.edit({ embeds: [embed] });
		interaction.reply(`${interaction.user} ${changeVote ? "changed votes to " : "voted for"} ${direction}.`).then(() => {
			// Decide by unanimous vote
			if (adventure.roomCandidates[direction].length === adventure.delvers.length) {
				embed.spliceFields(embed.fields.findIndex(field => field.title === "Decide the next room"), 1);
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
				interaction.message.edit({ embeds: [embed], components: uiRows });
				interaction.followUp(`The party moves on to ${direction}.`).then(message => {
					nextRoom(direction, adventure, interaction.channel);
				});
			}
		});
	} else {
		interaction.reply({ content: "Please vote on routes in adventures you've joined.", ephemeral: true });
	}
}
