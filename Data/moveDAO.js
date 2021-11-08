const { getFullName } = require("./combatantDAO.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getWeapon } = require("./Weapons/_weaponDictionary.js");

exports.resolveMove = function (move, adventure) {
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.room.enemies;
	let user = userTeam[move.userIndex];
	if (!user.modifiers.Stun) {
		let moveText = "";
		if (user.hp > 0) {
			moveText = `${user.name} used ${move.name} on`;
			let effect;
			let breakText = "";
			if (move.userTeam === "ally") {
				effect = getWeapon(move.name).effect;

				let weapon = user.weapons.find(weapon => weapon.name === move.name);
				weapon.uses--;
				if (weapon.uses === 0) {
					breakText = ` The ${weapon.name} broke!`;
				}
			} else {
				effect = getEnemy(user.name).actions[move.name].effect;
			}
			let resultTexts = move.targets.map(targetDatum => {
				let targetTeam;
				if (targetDatum.team === "ally") {
					targetTeam = adventure.delvers;
				} else {
					targetTeam = adventure.room.enemies;
				}
				return effect(targetTeam[targetDatum.index], user, move.isCrit, move.element, adventure);
			});
			let targetNames = exports.getTargetList(move.targets, adventure);
			moveText += ` ${targetNames.join(", ")}.${move.isCrit ? " *Critical Hit!*" : ""} ${resultTexts.join(" ")}${breakText !== "" ? breakText : ""}\n`;
		}
		return moveText;
	} else {
		delete user.modifiers.Stun;
		return `${user.name} is Stunned!\n`;
	}
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
