const { getFullName, dealDamage, gainHealth } = require("./combatantDAO.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getWeaponProperty } = require("./Weapons/_weaponDictionary.js");

exports.resolveMove = async function (move, adventure) {
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.room.enemies;
	let user = userTeam[move.userIndex];
	let moveText = "";
	if (user.hp > 0) {
		if (!user.modifiers.Stun) {
			moveText = `${user.name} used ${move.name} on`;
			let effect;
			let breakText = "";
			let targetAll = false;
			if (move.userTeam === "ally") {
				user.weapons[move.name]--;
				if (user.weapons[move.name] === 0) {
					breakText = ` The ${move.name} broke!`;
				}
				targetAll = getWeaponProperty(move.name, "targetingTags").target === "all";
				effect = getWeaponProperty(move.name, "effect");
			} else if (move.userTeam === "clone") {
				targetAll = getWeaponProperty(move.name, "targetingTags").target === "all";
				effect = getWeaponProperty(move.name, "effect");
			} else {
				effect = getEnemy(user.lookupName).actions[move.name].effect;
			}
			let resultText = await Promise.all(move.targets.map(async ({ team, index: targetIndex }) => {
				let targetTeam;
				if (team === "ally") {
					targetTeam = adventure.delvers;
				} else {
					targetTeam = adventure.room.enemies;
				}
				let result = await effect(targetTeam[targetIndex], user, move.isCrit, adventure);
				if (targetAll && result.endsWith("was already dead!")) {
					return "";
				} else {
					return result;
				}
			}));
			let targetNames = exports.getTargetList(move.targets, adventure);
			moveText += ` ${targetNames.join(", ")}.${move.isCrit ? " *Critical Hit!*" : ""} ${resultText.join(" ")}${breakText !== "" ? breakText : ""}`;
		} else {
			delete user.modifiers.Stun;
			moveText = `${user.name} is Stunned!`;
		}

		// Poison/Regen
		if (user.modifiers.Poison) {
			moveText += ` ${await dealDamage(user, null, user.modifiers.Poison * 10, "Poison", adventure)}`;
		} else if (user.modifiers.Regen) {
			moveText += ` ${gainHealth(user, user.modifiers.Regen * 10, adventure.room.enemyTitles)}`;
		}
	}
	return moveText + "\n";
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
