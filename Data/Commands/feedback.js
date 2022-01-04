const Command = require('../../Classes/Command.js');
const { guildID, feedbackChannel } = require('../../Config/versionData.json');

module.exports = new Command("feedback", "Provide feedback on Dungeon Tamers (eg a bug report or suggestion) and get a test server invite", false, false);

module.exports.data.addStringOption(option => option.setName("feedback").setDescription("Please describe the bug or feature request as clearly as possible").setRequired(true));

module.exports.execute = (interaction) => {
	// Post feedback to the test server channel and provide the user an invite
	let feedback = interaction.options.getString("feedback");
	let feedbackPreamble = `Feedback from <@${interaction.user.id}>:\n\t`;
	let ticketSpace = 2000 - feedbackPreamble.length;
	if (feedback.length < ticketSpace) {
		if (guildID && feedbackChannel) {
			interaction.client.guilds.fetch(guildID).then(testServer => {
				testServer.channels.fetch(feedbackChannel).then(channel => {
					channel.createInvite({ maxAge: 0 }).then(invite => {
						channel.send(feedbackPreamble + feedback);
						interaction.reply({ content: "Your feedback has been recorded! If you'd like to join the Imaginary Horizons Productions test server to chat with the devs, here's a link: " + invite.url, ephemeral: true });
					}).catch(console.error);
				})
			})
		} else {
			interaction.reply({ content: "The test server is not yet configured to receive feedback, thanks for your patience.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: `That message won't fit in our feedback tickets (${ticketSpace} characters max).`, ephemeral: true });
	}
}
