const Adventure = require("../Classes/Adventure.js");
const Move = require("../Classes/Move.js");
const { getFullName, dealDamage, gainHealth, removeModifier } = require("./combatantDAO.js");
const { getConsumable } = require("./consumables/_consumablesDictionary.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { selectAllFoes } = require("./enemyDAO.js");
const { getEquipmentProperty } = require("./equipment/_equipmentDictionary.js");

/** Updates game state with the move's effect AND returns the game's description of what happened
 * @param {Move} move
 * @param {Adventure} adventure
 * @returns {string} result text
 */
exports.resolveMove = async function (move, adventure) {
	let userTeam = move.userTeam === "delver" ? adventure.delvers : adventure.room.enemies;
	let user = userTeam[move.userIndex];
	if (user.hp > 0) {
		let moveText = `• ${getFullName(user, adventure.room.enemyTitles)} `;
		if (move.name !== "Stun" && user.getModifierStacks("Stun") < 1) {
			let effect;
			let targetAll = false;
			let breakText = "";
			switch (move.type) {
				case "action":
					if (move.userTeam !== "delver" && move.userTeam !== "clone") {
						const action = getEnemy(user.lookupName).actions[move.name];
						targetAll = action.selector === selectAllFoes;
						effect = action.effect;
					} else {
						// Special Case for Punch
						targetAll = getEquipmentProperty(move.name, "targetingTags").target === "all";
						effect = getEquipmentProperty(move.name, "effect");
					}
					break;
				case "equip":
					targetAll = getEquipmentProperty(move.name, "targetingTags").target === "all";
					effect = getEquipmentProperty(move.name, "effect");
					if (move.userTeam !== "clone") {
						let equip = user.equipment.find(equip => equip.name === move.name);
						equip.uses--;
						if (equip.uses < 1) {
							breakText = ` The ${move.name} broke!`;
						}
					}
					break;
				case "consumable":
					const { targetDescription, effect: consumableEffect } = getConsumable(move.name);
					targetAll = targetDescription === "all";
					effect = consumableEffect;
					if (move.userTeam !== "clone") {
						adventure.consumables[move.name]--;
						if (adventure.consumables[move.name] < 1) {
							delete adventure.consumables[move.name];
						}
					}
					break;
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
		const poisonStacks = user.getModifierStacks("Poison");
		const regenStacks = user.getModifierStacks("Regen");
		if (poisonStacks) {
			moveText += ` ${await dealDamage(user, null, poisonStacks * 10, true, "Poison", adventure)}`;
		} else if (regenStacks) {
			moveText += ` ${gainHealth(user, regenStacks * 10, adventure)}`;
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
