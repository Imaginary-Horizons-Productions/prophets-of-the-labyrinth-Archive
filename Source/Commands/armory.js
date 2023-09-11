const Command = require('../../Classes/Command.js');
const { embedTemplate } = require('../../helpers.js');
const { getColor } = require('../elementHelpers.js');
const { equipNames, equipmentExists, buildEquipmentDescription, getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

const id = "armory";
const options = [
	{ type: "String", name: "equipment-name", description: "The name of the equipment (case-sensitive)", required: true, autocomplete: true, choices: [] }
];
module.exports = new Command(id, "Look up the stats on a type of equipment", false, false, options);

module.exports.execute = (interaction) => {
	// Command specifications go here
	const equipmentName = interaction.options.getString(options[0].name);
	if (equipmentExists(equipmentName)) {
		const fields = [
			{ name: "Max Durability", value: getEquipmentProperty(equipmentName, "maxUses").toString() },
			{ name: "Base Value", value: getEquipmentProperty(equipmentName, "cost").toString() }
		];

		const upgrades = getEquipmentProperty(equipmentName, "upgrades");
		if (upgrades.length > 0) {
			fields.push({ name: "Upgrades Into", value: upgrades.join(", ") });
		}

		const sidegrades = getEquipmentProperty(equipmentName, "sidegrades");
		if (sidegrades.length > 0) {
			fields.push({ name: "Can be Tinkered Into", value: sidegrades.join(", ") });
		}

		const embed = embedTemplate(interaction.client.user.displayAvatarURL()).setColor(getColor(getEquipmentProperty(equipmentName, "element")))
			.setTitle(equipmentName)
			.setDescription(buildEquipmentDescription(equipmentName, true))
			.addFields(fields);
		interaction.reply({ embeds: [embed], ephemeral: true });
	} else {
		interaction.reply({ content: `Stats on **${equipmentName}** could not be found. Check for typos!`, ephemeral: true });
	}
}

module.exports.autocomplete = {
	"equipment-name": equipNames
};
