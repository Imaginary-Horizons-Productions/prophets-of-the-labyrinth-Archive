const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const { getAdventure } = require('../adventureDAO.js');

const id = "invite";
const options = [
	{ type: "User", name: "invitee", description: "The user's mention", required: true, choices: [] }
];
module.exports = new Command(id, "Invite a friend to an adventure", false, false, options);

module.exports.execute = (interaction) => {
	// Invite a friend to an adventure
	const adventure = getAdventure(interaction.channelId);
	if (adventure) {
		if (adventure.state === "config") {
			const invitee = interaction.options.getUser(options[0].name);
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
