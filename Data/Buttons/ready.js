const { getAdventure, nextRoom } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');
const { getGuild } = require('../guildDAO.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = new Button("ready");

module.exports.execute = (interaction, args) => {
	// Start an adventure if clicked by adventure leader
	let adventure = getAdventure(interaction.channel.id);
	if (interaction.user.id === adventure.leaderId) {
		// Clear components from recruitment, start, and deploy messages
		let guildProfile = getGuild(interaction.guild.id);
		interaction.guild.channels.fetch(guildProfile.centralId).then(channel => {
			channel.messages.fetch(adventure.recruitMessageId).then(recruitMessage => {
				recruitMessage.edit({ components: [] });
			})
		}).catch(console.error);
		interaction.channel.messages.fetch(adventure.deployMessageId).then(deployMessage => {
			deployMessage.edit({ components: [] });
		}).catch(console.error);
		interaction.channel.messages.fetch(adventure.startMessageId).then(startMessage => {
			startMessage.edit({ components: [] });
		}).catch(console.error);

		// Post utilities message
		let utilities = [new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("self")
					.setLabel("Inspect self")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("partystats")
					.setLabel("Party Stats")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("giveup")
					.setLabel("Give Up")
					.setStyle("DANGER")
			)];
		interaction.reply({ content: `The adventure has begun! Here are some utilities for the run (remember to \`Jump\` to the message if viewing from pins).`, components: utilities, fetchReply: true }).then(message => {
			message.pin();
			adventure.utilityMessageId = message.id;
			nextRoom(adventure, interaction.channel);
		});
	} else {
		interaction.reply("Please wait for the leader to start the adventure.");
	}
}
