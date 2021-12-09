const { getFullName, dealDamage, gainHealth } = require("./combatantDAO.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getWeaponProperty } = require("./Weapons/_weaponDictionary.js");

exports.resolveMove = async function (move, adventure) {
	let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.room.enemies;
	let user = userTeam[move.userIndex];
	if (user.hp > 0) {
		let moveText = `• ${getFullName(user, adventure.room.enemyTitles)} `;
		if (move.name !== "Stun" && !user.modifiers.Stun) {
			let targetNames = exports.getTargetList(move.targets, adventure).join(", ");
			let effect;
			let targetAll = false;
			let weaponBroke = false;
			if (move.userTeam === "ally" || move.userTeam === "clone") {
				effect = getWeaponProperty(move.name, "effect");
				if (move.userTeam !== "clone") {
					targetAll = getWeaponProperty(move.name, "targetingTags").target === "all";
					let weapon = user.weapons.find(weapon => weapon.name === move.name);
					weapon.uses--;
					weaponBroke = weapon.uses === 0;
				}
			} else {
				effect = getEnemy(user.lookupName).actions[move.name].effect;
			}
			let resultTexts = await Promise.all(move.targets.map(async ({ team, index: targetIndex }) => {
				if (team === "ally") {
					let result = await effect(adventure.delvers[targetIndex], user, move.isCrit, adventure);
					if (!targetAll || !result.endsWith("was already dead!")) {
						return result;
					} else {
						return "";
					}
				} else if (team === "enemy") {
					return await effect(adventure.room.enemies[targetIndex], user, move.isCrit, adventure);
				} else {
					return await effect(null, user, move.isCrit, adventure);
				}
			}));
			moveText += `used ${move.name}${move.targets[0].team !== "none" && move.targets[0].team !== "self" ? ` on ${targetNames}` : ""}.${move.isCrit ? " *Critical Hit!*" : ""} ${resultTexts.join(" ")}${weaponBroke ? ` The ${move.name} broke!` : ""}`;
		} else {
			delete user.modifiers.Stun;
			moveText += "is Stunned!";
		}

		// Poison/Regen
		if (user.modifiers.Poison) {
			moveText += ` ${await dealDamage(user, null, user.modifiers.Poison * 10, "Poison", adventure)}`;
		} else if (user.modifiers.Regen) {
			moveText += ` ${gainHealth(user, user.modifiers.Regen * 10, adventure.room.enemyTitles)}`;
		}
		return `${moveText}\n`;
	} else {
		return "";
	}
}

exports.getTargetList = function (targets, adventure) {
	return targets.map(targetIds => {
		let targetTeam;
		if (targetIds.team === "ally") {
			targetTeam = adventure.delvers;
		} else {
			targetTeam = adventure.room.enemies;
		}
		return getFullName(targetTeam[targetIds.index], adventure.room.enemyTitles);
	})
}
