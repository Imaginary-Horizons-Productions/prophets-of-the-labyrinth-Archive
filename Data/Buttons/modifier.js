const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { isBuff, isDebuff, getModifierDescription, isNonStacking } = require('../Modifiers/_modifierDictionary.js');

module.exports = new Button("modifier");

module.exports.execute = (interaction, [modifierName]) => {
	// Provide details about the given modifier
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let buff = isBuff(modifierName);
	let debuff = isDebuff(modifierName);
	let styleColor;
	if (buff) {
		styleColor = "BLURPLE";
	} else if (debuff) {
		styleColor = "RED";
	} else {
		styleColor = "GREY";
	}
	let embed = new MessageEmbed().setColor(styleColor)
		.setTitle(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${delver.modifiers[modifierName]}`}`)
		.setDescription(getModifierDescription(modifierName, delver))
		.addField("Category", `${buff ? "Buff" : debuff ? "Debuff" : "Modifier"}`);
	interaction.reply({ embeds: [embed], ephemeral: true });
}
