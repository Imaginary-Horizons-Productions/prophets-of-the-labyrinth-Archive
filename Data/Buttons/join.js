const Button = require('../../Classes/Button.js');
const Delver = require('../../Classes/Delver.js');
const { getAdventure, setAdventure } = require("./../adventureDAO.js");

module.exports = new Button("join");

module.exports.execute = (interaction, args) => {
	// Join an existing adventure
	let thread = interaction.message.thread;
	var adventure = getAdventure(thread.id);
	if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
		// Update game logic
		adventure.delvers.push(new Delver(interaction.user.id, interaction.member.displayName, adventure.id));
		adventure.lives++;
		adventure.gainGold(50);
		setAdventure(adventure);

		// Welcome player to thread
		thread.send(`${interaction.member} joined the adventure.`).then(() => {
			if (adventure.messageIds.start) {
				thread.messages.delete(adventure.messageIds.start);
				adventure.messageIds.start = "";
			}
		});

		// Update recruit message
		let partyList = `Leader: <@${adventure.leaderId}>`;
		for (let i = 0; i < adventure.delvers.length; i++) {
			if (adventure.delvers[i].id !== adventure.leaderId) {
				partyList += `\n<@${adventure.delvers[i].id}>`;
			}
		}
		interaction.update({ embeds: [interaction.message.embeds[0].spliceFields(0, 1, { name: `${adventure.delvers.length} Party Member${adventure.delvers.length == 1 ? "" : "s"}`, value: partyList })] });
	} else {
		interaction.reply({ content: "You are already part of this adventure!", ephemeral: true })
			.catch(console.error);
	}
}
