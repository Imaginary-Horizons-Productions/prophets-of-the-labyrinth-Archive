const Command = require('../../Classes/Command.js');

const options = [];
module.exports = new Command("ping", "Remind delvers to input their vote or move", false, false, options);

// imports from files that depend on /Config
let getAdventure;
module.exports.injectConfig = function (isProduction) {
	({ getAdventure } = require('../adventureDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	// Remind delvers to input their vote or move

	const adventure = getAdventure(interaction.channelId);
	if (adventure?.state !== "completed") {
		let mentions = adventure.delvers.reduce((ids, delver) => ids.add(delver.id), new Set());
		let inCombat = adventure.room.enemies && !adventure.room.enemies.every(enemy => enemy.hp === 0);
		if (inCombat) {
			adventure.room.moves.forEach(move => {
				if (move.userTeam === "delvers") {
					let userId = adventure.delvers[move.userIndex].id;
					if (mentions.has(userId)) {
						mentions.remove(userId);
					}
				}
			})
		} else {
			Object.values(adventure.roomCandidates).forEach(voteArray => {
				voteArray.forEach(id => {
					if (mentions.has(id)) {
						mentions.remove(id);
					}
				})
			})
		}
		interaction.reply({ content: `Waiting on <@${Array.from(mentions.values()).join(">, <@")}> to ${inCombat ? "ready their move(s)" : "vote"} before moving on.` });
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an active adventure thread.", ephemeral: true });
	}
}
