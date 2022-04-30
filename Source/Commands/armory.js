const Command = require('../../Classes/Command.js');
const { getColor } = require('../elementHelpers.js');

const options = [
	{ type: "String", name: "weapon-name", description: "The name of the weapon (case-sensitive)", required: true, choices: {} }
];
module.exports = new Command("armory", "Look up the stats on a weapon", false, false, options);


let // imports from files that depend on /Config
	// weapon_Dictionary
	weaponExists,
	buildWeaponDescription,
	getWeaponProperty,
	// helpers
	embedTemplate;
module.exports.injectConfig = function (isProduction) {
	({ weaponExists, buildWeaponDescription, getWeaponProperty } = require('../Weapons/_weaponDictionary.js').injectConfig(isProduction));
	({ embedTemplate } = require('../../helpers.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	// Command specifications go here
	const weaponName = interaction.options.getString("weapon-name");
	if (weaponExists(weaponName)) {
		const upgrades = getWeaponProperty(weaponName, "upgrades");
		let embed = embedTemplate(interaction.client.user.displayAvatarURL()).setColor(getColor(getWeaponProperty(weaponName, "element")))
			.setTitle(weaponName)
			.setDescription(buildWeaponDescription(weaponName, true))
			.addField("Max Durability", getWeaponProperty(weaponName, "maxUses").toString())
			.addField("Base Value", getWeaponProperty(weaponName, "cost").toString())
			.addField("Can be Tinkered Into", upgrades.length ? upgrades.join(", ") : "None");
		interaction.reply({ embeds: [embed], ephemeral: true });
	} else {
		interaction.reply({ content: `Stats on **${weaponName}** could not be found. Check for typos!`, ephemeral: true });
	}
}
