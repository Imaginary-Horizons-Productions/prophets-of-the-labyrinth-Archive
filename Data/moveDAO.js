const { getFullName } = require("./combatantDAO.js");

module.exports.resolveMove = function (move, adventure) {
	let moveText = "";
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.battleEnemies;
	let user = userTeam[move.userIndex];
	if (user.hp > 0) {
		let target;
		if (move.targetTeam === "ally") {
			target = adventure.delvers[move.targetIndex];
			//TODO #6 decrement weapon durability and check for breakage
		} else {
			target = adventure.battleEnemies[move.targetIndex];
		}
		let resultText = move.effect(target, user, move.isCrit, move.element, adventure);
		moveText += `${user.name} used ${move.name} on ${getFullName(target, adventure.battleEnemyTitles)}. ` + resultText + "\n";
	}
	return moveText;
}
