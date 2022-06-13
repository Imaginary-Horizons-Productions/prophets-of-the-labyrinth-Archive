const Command = require('../../Classes/Command.js');
const { getAdventure } = require('../adventureDAO.js');

const id = "ping";
const options = [];
module.exports = new Command(id, "Remind delvers to input their vote or move", false, false, options);

module.exports.execute = (interaction) => {
	// Remind delvers to input their vote or move
	const adventure = getAdventure(interaction.channelId);
	if (adventure && adventure.state !== "completed") {
		let mentions = adventure.delvers.reduce((ids, delver) => ids.add(delver.id), new Set());
		let inCombat = adventure.room.enemies && !adventure.room.enemies.every(enemy => enemy.hp === 0);
		if (inCombat) {
			adventure.room.moves.forEach(move => {
				if (move.userTeam === "delver") {
					let userId = adventure.delvers[move.userIndex].id;
					if (mentions.has(userId)) {
						mentions.delete(userId);
					}
				}
			})
		} else {
			Object.values(adventure.roomCandidates).forEach(voteArray => {
				voteArray.forEach(id => {
					if (mentions.has(id)) {
						mentions.delete(id);
					}
				})
			})
		}
		interaction.reply({ content: `Waiting on <@${Array.from(mentions.values()).join(">, <@")}> to ${inCombat ? "ready their move(s)" : "vote"} before moving on.` });
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an active adventure thread.", ephemeral: true });
	}
}
