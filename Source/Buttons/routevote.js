const { getAdventure, endRoom } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, ButtonBuilder, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require("../../constants.js");
const { clearComponents } = require('../../helpers.js');

const customId = "routevote";
module.exports = new Button(customId,
	/** Tally votes for next room */
	(interaction, [candidate, depth]) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const candidateTag = `${candidate}${SAFE_DELIMITER}${depth}`;
		if (adventure.roomCandidates[candidateTag]) {
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
									if (component.custom_id === `${customId}${SAFE_DELIMITER}${candidateTag}`) {
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
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
