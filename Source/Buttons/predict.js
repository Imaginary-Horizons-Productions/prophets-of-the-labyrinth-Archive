const { EmbedBuilder } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getColor } = require('../elementHelpers.js');
const { updateRoomHeader } = require('../roomDAO.js');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');

const customId = "predict";
module.exports = new Button(customId,
	/** Based on type, show the user information on the next battle round in an ephemeral message */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.getChallengeDuration("Blind Avarice") > 0) {
			const cost = adventure.getChallengeIntensity("Blind Avarice");
			if (adventure.gold >= cost) {
				adventure.gold -= cost;
				interaction.channel.messages.fetch(adventure.messageIds.battleRound).then(roomMessage => {
					updateRoomHeader(adventure, roomMessage);
					setAdventure(adventure);
				})
			} else {
				return interaction.reply({ content: "*Blind Avarice* prevents you from predicting until you get more gold.", ephemeral: true });
			}
		}
		const predictFunction = getArchetype(delver.archetype).predict;
		const [infoForNextRound, embed] = predictFunction(new EmbedBuilder().setColor(getColor(adventure.room.element)).setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` }), adventure);
		embed.setTitle(`${infoForNextRound ? "Predictions for" : "State of"} Round ${infoForNextRound ? adventure.room.round + 1 : adventure.room.round}`);
		interaction.reply({ embeds: [embed], ephemeral: true })
			.catch(console.error);
	}
);
