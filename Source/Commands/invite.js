const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getAdventure } = require('../adventureDAO.js');

const customId = "invite";
const options = [
	{ type: "User", name: "invitee", description: "The user's mention", required: true, choices: [] }
];
module.exports = new Command(customId, "Invite a friend to an adventure", false, false, options);

/** Invite a friend to an adventure */
module.exports.execute = (interaction) => {
	const adventure = getAdventure(interaction.channelId);
	if (adventure) {
		if (adventure.state == "config") {
			const invitee = interaction.options.getUser(options[0].name);
			invitee.send({
				content: `${interaction.member} has invited you to join *${adventure.name}* in ${interaction.guild}!`,
				components: [new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}invite`)
						.setLabel("Join")
						.setStyle(ButtonStyle.Success)
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
