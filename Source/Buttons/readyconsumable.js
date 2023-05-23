const Button = require('../../Classes/Button.js');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { getColor } = require('../elementHelpers.js');
const { getAdventure } = require('../adventureDAO.js');
const { SAFE_DELIMITER, MAX_SELECT_OPTIONS } = require('../../constants.js');
const { getConsumable } = require('../consumables/_consumablesDictionary.js');

const id = "readyconsumable";
module.exports = new Button(id, (interaction, args) => {
	// Show the delver stats of the user and provide components to ready a move
	const adventure = getAdventure(interaction.channel.id);
	const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		if (delver.getModifierStacks("Stun") < 1) { // Early out if stunned
			interaction.reply({
				embeds: [
					new EmbedBuilder().setColor(getColor(adventure.room.element))
						.setTitle("Readying a Consumable")
						.setDescription("Using a consumable has priority; it'll happen before non-priority actions.\n\nPick one option from below as your move for this round:")
						.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
				],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`consumable${SAFE_DELIMITER}${adventure.room.round}`)
							.setPlaceholder("Pick a consumable...")
							.addOptions(Object.keys(adventure.consumables).slice(0, MAX_SELECT_OPTIONS).reduce((options, consumable) => options.concat({
								label: `${consumable} (Held: ${adventure.consumables[consumable]})`,
								description: getConsumable(consumable).description,
								value: consumable
							}), [])))
				],
				ephemeral: true
			}).catch(console.error);
		} else {
			interaction.reply({ content: "You cannot pick a move because you are stunned this round.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please participate in combat in adventures you've joined.", ephemeral: true });
	}
});
