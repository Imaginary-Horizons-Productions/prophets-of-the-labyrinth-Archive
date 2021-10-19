const { getFullName } = require("./combatantDAO.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getWeapon } = require("./Weapons/_weaponDictionary.js");

module.exports.resolveMove = function (move, adventure) {
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.battleEnemies;
	let user = userTeam[move.userIndex];
	let moveText = "";
	let targetNames = [];
	let resultTexts = [];
	if (user.hp > 0) {
		moveText = `${user.name} used ${move.name} on`;
		let effect;
		if (move.userTeam === "ally") {
			effect = getWeapon(move.name).effect;
		} else {
			effect = getEnemy(user.name).actions[move.name].effect;
		}
		move.targets.forEach(targetIds => {
			let target;
			if (targetIds.team === "ally") {
				target = adventure.delvers[targetIds.index];
			} else {
				target = adventure.battleEnemies[targetIds.index];
			}
			resultTexts.push(effect(target, user, move.isCrit, move.element, adventure));
			if (targetIds.target === "self") {
				targetNames.push("themself");
			} else {
				targetNames.push(getFullName(target, adventure.battleEnemyTitles));
			}
		})
		moveText += ` ${targetNames.join(", ")}. ${resultTexts.join(" ")}\n`
	}
	return moveText;
}
