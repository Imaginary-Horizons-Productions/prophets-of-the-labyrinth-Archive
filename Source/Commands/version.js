const Command = require('../../Classes/Command.js');
const { getVersionEmbed } = require('./../../helpers.js');

const id = "version";
const options = [
	{ type: "Boolean", name: "full-notes", description: "Get the file with the full version notes?", required: true, choices: [] }
];
module.exports = new Command(id, "Get HorizonsBot's version notes", false, false, options);

module.exports.execute = (interaction) => {
	// Send version information
	if (interaction.options.getBoolean(options[0].name)) {
		interaction.reply({
			content: "Here are all the changes so far: ",
			files: [{
				attachment: "./ChangeLog.md",
				name: 'PotLChangeLog.md'
			}],
			ephemeral: true
		});
	} else {
		getVersionEmbed(interaction.client.user.displayAvatarURL()).then(embed => {
			interaction.reply({ embeds: [embed], ephemeral: true });
		}).catch(console.error);
	}
}
