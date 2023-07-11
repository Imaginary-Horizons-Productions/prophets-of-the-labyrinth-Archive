const { Interaction } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { gainHealth } = require('../combatantDAO.js');
const { editButtons, consumeRoomActions } = require('../roomDAO.js');

const id = "rest";
module.exports = new Button(id,
	/** Restore 30% max hp to the user
	 * @param {Interaction} interaction
	 * @param {Array<string>} args
	 */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (adventure.room.resources.roomAction.count > 0) {
			const { embeds, remainingActions } = consumeRoomActions(adventure, interaction.message.embeds, 1);
			let components = interaction.message.components;
			if (remainingActions < 1) {
				components = editButtons(components, {
					[id]: { preventUse: true, label: "The party rested", emoji: "✔️" },
					"viewchallenges": { preventUse: true, label: "The challenger is gone", emoji: "✖️" }
				});
			}
			interaction.update({ embeds, components }).then(() => {
				interaction.followUp(gainHealth(delver, Math.ceil(delver.maxHp * 0.30 * (1 - adventure.getChallengeIntensity("Restless") / 100.0)), adventure, 0));
				setAdventure(adventure);
			});
		} else {
			interaction.reply({ content: "No more actions can be taken in this room.", ephemeral: true });
		}
	});
