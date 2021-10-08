const { getFullName } = require("./combatantDAO.js");

module.exports.resolveMove = function (move, adventure) {
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.battleEnemies;
	let user = userTeam[move.userIndex];
	let moveText = "";
	let targetNames = [];
	let resultTexts = [];
	if (user.hp > 0) {
		moveText = `${user.name} used ${move.name} on`;
		move.targets.forEach(targetIds => {
			let target;
			if (targetIds.team === "ally") {
				target = adventure.delvers[targetIds.index];
			} else {
				target = adventure.battleEnemies[targetIds.index];
			}
			resultTexts.push(move.effect(target, user, move.isCrit, move.element, adventure));
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
