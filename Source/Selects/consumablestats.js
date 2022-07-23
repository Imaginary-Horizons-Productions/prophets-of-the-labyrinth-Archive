const { MessageEmbed } = require('discord.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const Select = require('../../Classes/Select.js');
const { getConsumable } = require('../consumables/_consumablesDictionary.js');

const id = "consumablestats";
module.exports = new Select(id, (interaction, args) => {
	// Provide information about the selected consumable
	const [consumableName, consumableCount] = interaction.values[0].split(SAFE_DELIMITER);
	const consumable = getConsumable(consumableName);
	let embed = new MessageEmbed()
		.setTitle(`${consumableName} x ${consumableCount}`)
		.setDescription(consumable.description)
		.addField("Element", consumable.element)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (consumable.flavorText.length) {
		embed.addField(...consumable.flavorText);
	}
	interaction.reply({ embeds: [embed], ephemeral: true });
});
