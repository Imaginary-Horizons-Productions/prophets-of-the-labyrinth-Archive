const { EmbedBuilder } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { modifiersToString } = require('../combatantDAO.js');
const { isBuff, isDebuff, getModifierDescription, isNonStacking } = require('../Modifiers/_modifierDictionary.js');

const id = "modifier";
module.exports = new Button(id, (interaction, [modifierName]) => {
	// Provide details about the given modifier
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (modifierName !== "MORE") {
		let buff = isBuff(modifierName);
		let debuff = isDebuff(modifierName);
		let styleColor;
		if (buff) {
			styleColor = "5865f2";
		} else if (debuff) {
			styleColor = "ed4245";
		} else {
			styleColor = "4f545c";
		}
		let embed = new EmbedBuilder().setColor(styleColor)
			.setTitle(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${delver.modifiers[modifierName]}`}`)
			.setDescription(getModifierDescription(modifierName, delver))
			.addFields({ name: "Category", value: `${buff ? "Buff" : debuff ? "Debuff" : "Modifier"}` });
		interaction.reply({ embeds: [embed], ephemeral: true });
	} else {
		let embed = new EmbedBuilder().setColor("4f545c")
			.setTitle("All Modifiers")
			.setDescription(modifiersToString(delver, true))
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
});
