const Command = require('../../Classes/Command.js');

const options = [
	{ type: "Boolean", name: "full-notes", description: "Get the file with the full version notes?", required: true, choices: {} }
];
module.exports = new Command("version", "Get HorizonsBot's version notes", false, false, options);

// imports from files that depend on /Config
let versionEmbedBuilder;
module.exports.initialize = function (isProduction) {
	if (isProduction) {
		({ versionEmbedBuilder } = require("./../../helpers.js"));
	}
	return this;
}

module.exports.execute = (interaction) => {
	// Send version information
	if (interaction.options.getBoolean("full-notes")) {
		interaction.reply({
			content: "Here are all the changes so far: ",
			files: [{
				attachment: "./ChangeLog.md",
				name: 'PotLChangeLog.md'
			}],
			ephemeral: true
		});
	} else {
		versionEmbedBuilder(interaction.client.user.displayAvatarURL()).then(embed => {
			interaction.reply({ embeds: [embed], ephemeral: true });
		}).catch(console.error);
	}
}
