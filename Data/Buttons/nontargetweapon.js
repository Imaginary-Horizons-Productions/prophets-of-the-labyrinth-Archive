const Button = require('../../Classes/Button.js');
const Move = require('../../Classes/Move');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage, generateRandomNumber, endRound } = require('../adventureDAO');

module.exports = new Button("nontargetweapon");

module.exports.execute = (interaction, [weaponIndex]) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (parseInt(weaponIndex) < user.weapons.length) {
		let weapon = user.weapons[weaponIndex];

		// Add move to round list (overwrite exisiting readied move)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		let newMove = new Move()
			.setSpeed(user)
			.setIsCrit(user.crit)
			.setMoveName(weapon.name)
			.setUser(user.team, userIndex);

		let targetText = "";
		let targetTeam = weapon.targetingTags.team;
		if (weapon.targetingTags.target === "all") {
			let targetCount = 0;
			if (targetTeam === "ally") {
				targetCount = adventure.delvers.length;
				targetText = "all allies";
			} else if (targetTeam === "enemy") {
				targetCount = adventure.room.enemies.length;
				targetText = "all enemies";
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(targetTeam, i);
			}
		} else if (weapon.targetingTags.target.startsWith("random")) {
			let randomCount = Number(weapon.targetingTags.target.split("-")[1]);
			let poolSize = 0;
			if (targetTeam === "ally") {
				poolSize = adventure.delvers.length;
				targetText = `${randomCount} random all${randomCount === 1 ? "y" : "ies"}`;
			} else if (targetTeam === "enemy") {
				poolSize = adventure.room.enemies.length;
				targetText = `${randomCount} random enem${randomCount === 1 ? "y" : "ies"}`;
			}
			for (let i = 0; i < randomCount; i++) {
				newMove.addTarget(targetTeam, generateRandomNumber(adventure, poolSize, "battle"));
			}
		} else if (weapon.targetingTags.target === "self") {
			newMove.addTarget(targetTeam, userIndex);
			targetText = "themself";
		}

		let overwritten = false;
		for (let i = 0; i < adventure.room.moves.length; i++) {
			let move = adventure.room.moves[i];
			if (move.userTeam === user.team && move.userIndex === userIndex) {
				adventure.room.moves.splice(i, 1, newMove);
				overwritten = true;
				break;
			}
		}
		if (!overwritten) {
			adventure.room.moves.push(newMove);
		}

		// Send confirmation text
		interaction.reply(`${interaction.user} readies **${weapon.name}** to use on **${targetText}**.`).then(() => {
			saveAdventures();
			updateRoundMessage(interaction.channel.messages, adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			};
		}).catch(console.error);
	} else {
		interaction.reply({ content: `You don't have that weapon anymore.`, ephemeral: true })
			.catch(console.error);
	}
}
