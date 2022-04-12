const { getFullName, dealDamage, gainHealth, removeModifier } = require("./combatantDAO.js");

let getEnemy, selectAllFoes, getWeaponProperty;
exports.injectConfig = function (isProduction) {
	({ getEnemy } = require("./Enemies/_enemyDictionary.js").injectConfigEnemies(isProduction));
	({ selectAllFoes } = require("./enemyDAO.js").injectConfig(isProduction));
	({ getWeaponProperty } = require("./Weapons/_weaponDictionary.js").injectConfig(isProduction));
	return this;
}

exports.resolveMove = async function (move, adventure) {
	let userTeam = move.userTeam === "delver" ? adventure.delvers : adventure.room.enemies;
	let user = userTeam[move.userIndex];
	if (user.hp > 0) {
		let moveText = `• ${getFullName(user, adventure.room.enemyTitles)} `;
		if (move.name !== "Stun" && !user.modifiers.Stun) {
			let effect;
			let targetAll = false;
			let breakText = "";
			if (move.userTeam === "delver" || move.userTeam === "clone") {
				effect = getWeaponProperty(move.name, "effect");
				if (move.userTeam !== "clone") {
					targetAll = getWeaponProperty(move.name, "targetingTags").target === "all"
					if (move.name !== "Punch") {
						let weapon = user.weapons.find(weapon => weapon.name === move.name);
						weapon.uses--;
						if (weapon.uses === 0) {
							breakText = ` The ${move.name} broke!`;
						}
					}
				}
			} else {
				let action = getEnemy(user.lookupName).actions[move.name];
				effect = action.effect;
				targetAll = action.selector === selectAllFoes;
			}

			// An arry containing move result texts
			let resultTexts = await Promise.all(move.targets.map(async ({ team, index: targetIndex }) => {
				let currentTarget = null;
				if (team === "delver") {
					currentTarget = adventure.delvers[targetIndex];
				} else if (team === "enemy") {
					currentTarget = adventure.room.enemies[targetIndex];
				}
				if (!currentTarget || currentTarget.hp > 0) {
					return await effect(currentTarget, user, move.isCrit, adventure);
				} else {
					if (!targetAll) {
						return ` ${getFullName(currentTarget, adventure.room.enemyTitles)} was already dead!`;
					} else {
						// Omit "already dead" messages from AoE moves
						return "";
					}
				}
			}).filter(text => text !== ""));

			// eg "used {move name}[ on {targets}]"
			let targetStatement = `used ${move.name}`;
			if (targetAll) {
				let team = "combatants";
				if (move.targets.every(target => target.team === move.userTeam)) {
					team = "allies";
				} else if (move.targets.every(target => target.team !== move.userTeam)) {
					team = "foes";
				}
				targetStatement += ` on all ${team}`;
			} else if (move.targets[0].team !== "none" && move.targets[0].team !== "self") {
				targetStatement += ` on ${exports.getTargetList(move.targets, adventure).join(", ")}`;
			}
			moveText += `${targetStatement}.${move.isCrit ? " *Critical Hit!*" : ""} ${resultTexts.join(" ")}${breakText}`;
		} else {
			removeModifier(user, { name: "Stun", stacks: "all" });
			moveText += "is Stunned!";
		}

		// Poison/Regen
		if (user.modifiers.Poison) {
			moveText += ` ${await dealDamage(user, null, user.modifiers.Poison * 10, true, "Poison", adventure)}`;
		} else if (user.modifiers.Regen) {
			moveText += ` ${gainHealth(user, user.modifiers.Regen * 10, adventure)}`;
		}
		return `${moveText}\n`;
	} else {
		return "";
	}
}

exports.getTargetList = function (targets, adventure) {
	let targetList = [];
	for (const targetData of targets) {
		let targetTeam;
		if (targetData.team === "none") {
			continue;
		} else if (targetData.team === "delver") {
			targetTeam = adventure.delvers;
		} else {
			targetTeam = adventure.room.enemies;
		}
		targetList.push(getFullName(targetTeam[targetData.index], adventure.room.enemyTitles));
	}
	return targetList;
}
