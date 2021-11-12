const { getFullName } = require("./combatantDAO.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getWeapon } = require("./Weapons/_weaponDictionary.js");

exports.resolveMove = async function (move, adventure) {
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.room.enemies;
	let user = userTeam[move.userIndex];
	if (!user.modifiers.Stun) {
		let moveText = "";
		if (user.hp > 0) {
			moveText = `${user.name} used ${move.name} on`;
			let effect;
			let breakText = "";
			let targetAll = false;
			if (move.userTeam === "ally") {
				let weapon = user.weapons.find(weapon => weapon.name === move.name);
				weapon.uses--;
				if (weapon.uses === 0) {
					breakText = ` The ${weapon.name} broke!`;
				}
				targetAll = weapon.targetingTags.target === "all";
				effect = getWeapon(move.name).effect; // get from dictionary because weapons saved from file don't have their effect function any more
			} else {
				effect = getEnemy(user.lookupName).actions[move.name].effect;
			}
			let resultText = await Promise.all(move.targets.map(async targetDatum => {
				let targetTeam;
				if (targetDatum.team === "ally") {
					targetTeam = adventure.delvers;
				} else {
					targetTeam = adventure.room.enemies;
				}
				let result = await effect(targetTeam[targetDatum.index], user, move.isCrit, move.element, adventure);
				if (targetAll && result.endsWith("was already dead!")) {
					return "";
				} else {
					return result;
				}
			}));
			let targetNames = exports.getTargetList(move.targets, adventure);
			moveText += ` ${targetNames.join(", ")}.${move.isCrit ? " *Critical Hit!*" : ""} ${resultText.join(" ")}${breakText !== "" ? breakText : ""}\n`;
		}
		return moveText;
	} else {
		delete user.modifiers.Stun;
		return `${user.name} is Stunned!\n`;
	}
}

exports.getTargetList = function (targets, adventure) {
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
