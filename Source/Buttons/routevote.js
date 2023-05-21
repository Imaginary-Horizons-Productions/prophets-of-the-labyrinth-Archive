const { getAdventure, endRoom } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { SAFE_DELIMITER } = require("../../constants.js");
const { clearComponents } = require('../../helpers.js');

const id = "routevote";
module.exports = new Button(id, (interaction, [candidate, depth]) => {
	// Tally votes for next room
	let adventure = getAdventure(interaction.channel.id);
	const candidateTag = `${candidate}${SAFE_DELIMITER}${depth}`;
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

			interaction.reply(`${interaction.user} ${changeVote ? "changed their vote to" : "voted for"} ${candidate}.`).then(_message => {
				// Decide by unanimous vote
				if (adventure.roomCandidates[candidateTag]?.length === adventure.delvers.length) {
					clearComponents(adventure.messageIds.battleRound, interaction.channel.messages);
					let uiRows = [...interaction.message.components.map(row => {
						return new ActionRowBuilder().addComponents(row.components.map(({ data: component }) => {
							switch (component.type) {
								case ComponentType.Button:
									const updatedButton = new ButtonBuilder(component).setDisabled(true);
									if (component.custom_id === `${id}${SAFE_DELIMITER}${candidateTag}`) {
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
						}))
					})];
					interaction.message.edit({ components: uiRows });
					endRoom(candidate, interaction.channel);
				}
			});
		} else {
			interaction.reply({ content: "Please vote on routes in adventures you've joined.", ephemeral: true });
		}
	} else {
		interaction.update({ content: "\u200B" });
	}
});
