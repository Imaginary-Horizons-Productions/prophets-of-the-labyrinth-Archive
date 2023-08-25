const { Interaction } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { gainHealth } = require('../combatantDAO.js');
const { editButtons, consumeRoomActions } = require('../roomDAO.js');

const customId = "rest";
module.exports = new Button(customId,
	/** Restore healPercent max hp to the user
	 * @param {Interaction} interaction
	 * @param {string[]} args
	 */
	(interaction, [healPercent]) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "No more actions can be taken in this room.", ephemeral: true });
			return;
		}

		const { embeds, remainingActions } = consumeRoomActions(adventure, interaction.message.embeds, 1);
		let components = interaction.message.components;
		if (remainingActions < 1) {
			components = editButtons(components, {
				[customId]: { preventUse: true, label: "The party rested", emoji: "✔️" },
				"viewchallenges": { preventUse: true, label: "The challenger is gone", emoji: "✖️" }
			});
		}
		interaction.update({ embeds, components }).then(() => {
			interaction.followUp(gainHealth(delver, Math.ceil(delver.maxHp * (parseInt(healPercent) / 100.0)), adventure, 0));
			setAdventure(adventure);
		});
	}
);
