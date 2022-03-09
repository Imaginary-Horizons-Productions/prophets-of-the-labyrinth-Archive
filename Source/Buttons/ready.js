const { getAdventure, nextRoom } = require('../adventureDAO.js');
const Button = require('../../Classes/Button.js');

module.exports = new Button("ready");

module.exports.execute = (interaction, _args) => {
	// Start an adventure if clicked by adventure leader
	let adventure = getAdventure(interaction.channel.id);
	if (interaction.user.id === adventure.leaderId) {
		// Clear components from recruitment, start, and deploy messages
		interaction.channel.fetchStarterMessage().then(recruitMessage => {
			recruitMessage.edit({ components: [] });
		}).catch(console.error);
		if (adventure.messageIds.deploy) {
			interaction.channel.messages.delete(adventure.messageIds.deploy);
			delete adventure.messageIds.deploy;
		}
		interaction.message.delete();
		delete adventure.messageIds.start;

		adventure.delvers.forEach(delver => {
			if (delver.startingArtifact) {
				adventure.gainArtifact(delver.startingArtifact, 1);
			}
		})

		interaction.reply({ content: `The adventure has begun (and closed to new delvers joining)! You can use \`/delver-stats\`, or \`/party-stats\` to check adventure status. The leader can \`/give-up\`.`, fetchReply: true }).then(message => {
			message.pin();
			adventure.state = "ongoing";
			adventure.messageIds.utility = message.id;
			nextRoom("Battle", adventure, interaction.channel);
		});
	} else {
		interaction.reply({ content: "Please wait for the leader to start the adventure.", ephemeral: true });
	}
}
