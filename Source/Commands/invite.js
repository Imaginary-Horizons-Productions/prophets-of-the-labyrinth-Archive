const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { getAdventure } = require('../adventureDAO.js');

const options = [
	{ type: "User", name: "invitee", description: "The user's mention", required: true, choices: {} }
];
module.exports = new Command("invite", "Invite a friend to an adventure", false, false, options);

// imports from files that depend on /Config
// let ;
module.exports.initialize = function (helpers) {
	({} = helpers);
}

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
