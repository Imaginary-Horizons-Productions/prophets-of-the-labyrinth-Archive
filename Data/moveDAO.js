const { getFullName } = require("./combatantDAO.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getWeapon } = require("./Weapons/_weaponDictionary.js");

exports.resolveMove = function (move, adventure) {
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.room.enemies;
	let user = userTeam[move.userIndex];
	let moveText = "";
	if (user.hp > 0) {
		moveText = `${user.name} used ${move.name} on`;
		let effect;
		if (move.userTeam === "ally") {
			effect = getWeapon(move.name).effect;
		} else {
			effect = getEnemy(user.name).actions[move.name].effect;
		}
		let resultTexts = move.targets.map(targetIds => {
			let targetTeam;
			if (targetIds.team === "ally") {
				targetTeam = adventure.delvers;
			} else {
				targetTeam = adventure.room.enemies;
			}
			return effect(targetTeam[targetIds.index], user, move.isCrit, move.element, adventure);
		});
		let targetNames = exports.getTargetList(move.targets, adventure);
		moveText += ` ${targetNames.join(", ")}.${move.isCrit ? " *Critical Hit!*" : ""} ${resultTexts.join(" ")}\n`
	}
	return moveText;
}

exports.getTargetList = (targets, adventure) => {
	return targets.map(targetIds => {
		if (targetIds.team === "self") {
			return "themself";
		} else {
			let targetTeam;
			if (targetIds.team === "ally") {
				targetTeam = adventure.delvers;
			} else {
				targetTeam = adventure.room.enemies;
			}
			return getFullName(targetTeam[targetIds.index], adventure.room.enemyTitles);
		}
	})
}
