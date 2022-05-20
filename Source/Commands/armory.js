const Command = require('../../Classes/Command.js');
const { embedTemplate } = require('../../helpers.js');
const { getColor } = require('../elementHelpers.js');
const { equipmentExists, buildEquipmentDescription, getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

const options = [
	{ type: "String", name: "equipment-name", description: "The name of the equipment (case-sensitive)", required: true, choices: [] }
];
module.exports = new Command("armory", "Look up the stats on a type of equipment", false, false, options);

module.exports.execute = (interaction) => {
	// Command specifications go here
	const equipmentName = interaction.options.getString("equipment-name");
	if (equipmentExists(equipmentName)) {
		const upgrades = getEquipmentProperty(equipmentName, "upgrades");
		let embed = embedTemplate(interaction.client.user.displayAvatarURL()).setColor(getColor(getEquipmentProperty(equipmentName, "element")))
			.setTitle(equipmentName)
			.setDescription(buildEquipmentDescription(equipmentName, true))
			.addField("Max Durability", getEquipmentProperty(equipmentName, "maxUses").toString())
			.addField("Base Value", getEquipmentProperty(equipmentName, "cost").toString())
			.addField("Can be Tinkered Into", upgrades.length ? upgrades.join(", ") : "None");
		interaction.reply({ embeds: [embed], ephemeral: true });
	} else {
		interaction.reply({ content: `Stats on **${equipmentName}** could not be found. Check for typos!`, ephemeral: true });
	}
}
