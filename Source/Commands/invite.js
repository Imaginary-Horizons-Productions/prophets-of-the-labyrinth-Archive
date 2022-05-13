const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');

const options = [
	{ type: "User", name: "invitee", description: "The user's mention", required: true, choices: {} }
];
module.exports = new Command("invite", "Invite a friend to an adventure", false, false, options);

let // imports from files that depend on /Config
	// helpers
	SAFE_DELIMITER,
	// adventureDAO
	getAdventure;
module.exports.injectConfig = function (isProduction) {
	({ SAFE_DELIMITER } = require('../../helpers.js').injectConfig(isProduction));
	({ getAdventure } = require('../adventureDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	// Invite a friend to an adventure
	const adventure = getAdventure(interaction.channelId);
	if (adventure) {
		if (adventure.state === "config") {
			const invitee = interaction.options.getUser("invitee");
			invitee.send({
				content: `${interaction.member} has invited you to join *${adventure.name}* in ${interaction.guild}!`,
				components: [new MessageActionRow().addComponents(
					new MessageButton().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}invite`)
						.setLabel("Join")
						.setStyle("SUCCESS")
				)]
			});
			interaction.reply({ content: "Invite sent!", ephemeral: true });
		} else {
			interaction.reply({ content: "Invites cannot be sent after an adventure has started.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please send invites from adventure threads.", ephemeral: true });
	}
}
