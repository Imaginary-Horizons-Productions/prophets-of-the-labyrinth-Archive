const Command = require('../../Classes/Command.js');
const { embedTemplate } = require('../../helpers.js');
const { getAdventure } = require('../adventureDAO.js');
const { consumableExists, getConsumable } = require('../consumables/_consumablesDictionary.js');
const { getColor } = require('../elementHelpers.js');

const id = "consumable-info";
const options = [
	{ type: "String", name: "consumable-name", description: "The name of the consumable (case-sensitive)", required: true, choices: [] }
];
module.exports = new Command(id, "Look up the info on a consumable", false, false, options);

module.exports.execute = (interaction) => {
	// Returns a message containing the given consumable's game info
	const consumableName = interaction.options.getString(options[0].name);
	if (consumableExists(consumableName)) {
		const { element, description } = getConsumable(consumableName);
		const adventure = getAdventure(interaction.channelId);
		const numberHeld = adventure?.consumables[consumableName] || 0;
		const embed = embedTemplate(interaction.client.user.displayAvatarURL()).setColor(getColor(element))
			.setTitle(consumableName)
			.setDescription(description);
		if (adventure) {
			embed.addField("Number Held", numberHeld.toString());
		}
		interaction.reply({ embeds: [embed], ephemeral: true });
	} else {
		interaction.reply({ content: `Stats on **${consumableName}** could not be found. Check for typos!`, ephemeral: true });
	}
}
