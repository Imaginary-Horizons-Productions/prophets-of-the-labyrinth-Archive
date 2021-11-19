const { getFullName, dealDamage, gainHealth } = require("./combatantDAO.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getWeapon } = require("./Weapons/_weaponDictionary.js");

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
				let weapon = user.weapons.find(weapon => weapon.name === move.name);
				weapon.uses--;
				if (weapon.uses === 0) {
					breakText = ` The ${weapon.name} broke!`;
				}
				targetAll = weapon.targetingTags.target === "all";
				effect = getWeapon(move.name).effect; // get from dictionary because weapons saved from file don't have their effect function any more
			} else if (move.userTeam === "clone") {
				let weapon = adventure.delvers[move.userIndex].weapons.find(weapon => weapon.name === move.name);
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
				let result = await effect(targetTeam[targetDatum.index], user, move.isCrit, adventure);
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
