const { Interaction } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { gainHealth } = require('../combatantDAO.js');
const { editButtons } = require('../roomDAO.js');

const id = "rest";
module.exports = new Button(id,
	/** Restore 30% max hp to the user
	 * @param {Interaction} interaction
	 * @param {Array<string>} args
	 */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (delver) {
			if (adventure.room.resources.roomAction.count > 0) {
				const remainingActions = --adventure.room.resources.roomAction.count;
				const embeds = interaction.message.embeds.map(embed =>
					embed.spliceFields(embed.fields.findIndex(field => field.name === "Room Actions"), 1, { name: "Room Actions", value: remainingActions.toString() })
				);
				let components = interaction.message.components;
				if (remainingActions < 1) {
					components = editButtons(components, {
						[id]: { preventUse: true, label: "The party rested", emoji: "✔️" },
						"viewchallenges": { preventUse: true, label: "The challenger is gone", emoji: "✖️" }
					})
				}
				interaction.update({ embeds, components }).then(() => {
					interaction.followUp(gainHealth(delver, delver.maxHp * 0.30 * (1 - adventure.getChallengeIntensity("Restless")/100.0), adventure, 0));
					setAdventure(adventure);
				});
			} else {
				interaction.reply({ content: "No more actions can be taken in this room.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "Please rest at rest sites in adventures you've joined.", ephemeral: true });
		}
	});
