const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { getAdventure } = require('../adventureDAO.js');

module.exports = new Command("invite", "Invite a friend to an adventure", false, false);
module.exports.data.addUserOption(option => option.setName("invitee").setDescription("The user's mention").setRequired(true));

module.exports.execute = (interaction) => {
	// Invite a friend to an adventure
	const adventure = getAdventure(interaction.channel.id);
	if (adventure) {
		if (!adventure.messageIds.utility) {
			const invitee = interaction.options.getUser("invitee");
			invitee.send({
				content: `${interaction.member} has invited you to join *${adventure.name}* in ${interaction.guild}!`,
				components: [new MessageActionRow().addComponents(
					new MessageButton().setCustomId(`join-${interaction.guildId}-${interaction.channelId}`)
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
