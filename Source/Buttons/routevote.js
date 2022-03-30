const { nextRoom, getAdventure } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { SAFE_DELIMITER, clearComponents } = require('../../helpers.js');

module.exports = new Button("routevote");

module.exports.execute = (interaction, [candidate, depth]) => {
	// Tally votes for next room
	let adventure = getAdventure(interaction.channel.id);
	const candidateTag = candidate + SAFE_DELIMITER + depth;
	if (adventure.roomCandidates[candidateTag]) {
		let delverIds = adventure.delvers.map(delver => delver.id);
		if (delverIds.includes(interaction.user.id)) {
			let changeVote = false;
			for (const candidate in adventure.roomCandidates) {
				if (adventure.roomCandidates[candidate].includes(interaction.user.id)) {
					changeVote = true;
					adventure.roomCandidates[candidate] = adventure.roomCandidates[candidate].filter(id => id !== interaction.user.id);
				}
			}
			adventure.roomCandidates[candidateTag].push(interaction.user.id);

			interaction.reply(`${interaction.user} ${changeVote ? "changed their vote to" : "voted for"} ${candidateTag}.`).then(() => {
				// Decide by unanimous vote
				if (adventure.roomCandidates[candidateTag].length === adventure.delvers.length) {
					clearComponents(adventure.messageIds.battleRound, interaction.channel.messages);
					let uiRows = [...interaction.message.components.map(row => {
						return new MessageActionRow().addComponents(...row.components.map(component => {
							let editedComponent = component.setDisabled(true);
							if (component.customId === `routevote${SAFE_DELIMITER}${candidateTag}`) {
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
					interaction.followUp(`The party moves on to ${candidate}.`).then(message => {
						nextRoom(candidate, adventure, interaction.channel);
					});
				}
			});
		} else {
			interaction.update({ content: "\u200B" });
		}
	} else {
		interaction.reply({ content: "Please vote on routes in adventures you've joined.", ephemeral: true });
	}
}
