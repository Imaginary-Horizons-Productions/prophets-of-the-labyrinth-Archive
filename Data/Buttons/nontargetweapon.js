const Button = require('../../Classes/Button.js');
const Move = require('../../Classes/Move');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage, generateRandomNumber, endRound } = require('../adventureDAO');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("nontargetweapon");

module.exports.execute = (interaction, [weaponName]) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (weaponName in user.weapons) {
		// Add move to round list (overwrite exisiting readied move)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		let newMove = new Move()
			.setSpeed(user)
			.setIsCrit(user.crit)
			.setMoveName(weaponName)
			.setUser(user.team, userIndex);

		let targetText = "";
		let { target, team } = getWeaponProperty(weaponName, "targetingTags");
		if (target === "all") {
			let targetCount = 0;
			if (team === "ally") {
				targetCount = adventure.delvers.length;
				targetText = "all allies";
			} else if (team === "enemy") {
				targetCount = adventure.room.enemies.length;
				targetText = "all enemies";
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(team, i);
			}
		} else if (target.startsWith("random")) {
			let targetCount = Number(target.split("-")[1]);
			let poolSize = 0;
			if (team === "ally") {
				poolSize = adventure.delvers.length;
				targetText = `${targetCount} random all${targetCount === 1 ? "y" : "ies"}`;
			} else if (team === "enemy") {
				poolSize = adventure.room.enemies.length;
				targetText = `${targetCount} random enem${targetCount === 1 ? "y" : "ies"}`;
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(team, generateRandomNumber(adventure, poolSize, "battle"));
			}
		} else if (target === "self") {
			newMove.addTarget(team, userIndex);
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
		interaction.reply(`${interaction.user} readies **${weaponName}** to use on **${targetText}**.`).then(() => {
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
