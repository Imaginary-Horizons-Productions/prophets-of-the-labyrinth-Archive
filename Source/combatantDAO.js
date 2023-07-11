const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const Combatant = require("../Classes/Combatant.js");
const { getInverse, isNonStacking, getModifierDescription, isBuff, isDebuff } = require("./Modifiers/_modifierDictionary.js");
const { getWeakness } = require("./elementHelpers.js");
const Adventure = require("../Classes/Adventure.js");

/** Speed is affected by `roundSpeed` and modifiers
 * @param {Delver | Enemy} combatant
 * @returns {number}
 */
exports.calculateTotalSpeed = function (combatant) {
	let totalSpeed = combatant.speed + combatant.roundSpeed;
	if ("Slow" in combatant.modifiers) {
		const slowStacks = combatant.getModifierStacks("Slow");
		totalSpeed -= slowStacks * 5;
	}
	if ("Quicken" in combatant.modifiers) {
		const quickenStacks = combatant.getModifierStacks("Quicken");
		totalSpeed += quickenStacks * 5;
	}
	return Math.ceil(totalSpeed);
}

exports.dealDamage = async function (target, user, damage, isUnblockable, element, adventure) {
	let targetName = target.getName(adventure.room.enemyIdMap);
	let targetModifiers = Object.keys(target.modifiers);
	if (!targetModifiers.includes(`${element} Absorb`)) {
		if (!targetModifiers.includes("Evade") || isUnblockable) {
			let limitBreak = user?.modifiers["Power Up"] || 0;
			let pendingDamage = damage + limitBreak;
			if (targetModifiers.includes("Exposed")) {
				pendingDamage *= 1.5;
			}
			let isWeakness = getWeakness(target.element) === element;
			if (isWeakness) {
				pendingDamage *= 2;
			}
			let isResistance = target.element === element;
			if (isResistance) {
				pendingDamage = pendingDamage / 2;
			}
			pendingDamage = Math.ceil(pendingDamage);
			let blockedDamage = 0;
			if (!isUnblockable) {
				if (pendingDamage >= target.block) {
					pendingDamage -= target.block;
					blockedDamage = target.block;
					target.block = 0;
				} else {
					target.block -= pendingDamage;
					blockedDamage = pendingDamage;
					pendingDamage = 0;
				}
			}
			let damageCap = 500 + limitBreak;
			pendingDamage = Math.min(pendingDamage, damageCap);
			target.hp -= pendingDamage;
			let damageText = ` **${targetName}** takes ${pendingDamage} damage${blockedDamage > 0 ? ` (${blockedDamage} was blocked)` : ""}${element === "Poison" ? " from Poison" : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
			if (element !== "Poison" && targetModifiers.includes("Curse of Midas")) {
				adventure.gainGold(Math.floor(pendingDamage / 10));
				damageText += ` Gold scatters about the room.`;
			}
			if (target.hp <= 0) {
				if (target.team === "delver") {
					target.hp = target.maxHp;
					adventure.lives -= 1;
					damageText += ` *${targetName} has died* and been revived. ***${adventure.lives} lives remain.***`;
				} else {
					target.hp = 0;
					damageText += ` *${targetName} has died*.`;
				}
			}
			return damageText;
		} else {
			target.modifiers["Evade"]--;
			if (target.modifiers["Evade"] <= 0) {
				delete target.modifiers["Evade"];
			}
			return ` ${targetName} evades the attack!`;
		}
	} else {
		return ` ${exports.gainHealth(target, damage, adventure)}`;
	}
}

/**
 * @param {Combatant} user
 * @param {number} damage
 * @param {Adventure} adventure
 */
exports.payHP = function (user, damage, adventure) {
	user.hp -= damage;
	let userName = user.getName(adventure.room.enemyIdMap);
	let resultText = ` **${userName}** pays ${damage} hp.`;
	if (user.hp <= 0) {
		if (user.team === "delver") {
			user.hp = user.maxHp;
			adventure.lives -= 1;
			resultText += ` *${userName} has died* and been revived. ***${adventure.lives} lives remain.***`;
		} else {
			user.hp = 0;
			resultText += ` *${userName} has died*.`;
		}
	}
	return resultText;
}

exports.gainHealth = function (combatant, healing, adventure, inCombat = true) {
	combatant.hp += healing;
	let excessHealing = 0;
	let bloodshieldSwordCount = adventure.getArtifactCount("Bloodshield Sword");
	if (combatant.hp > combatant.maxHp) {
		excessHealing = combatant.hp - combatant.maxHp;
		combatant.hp = combatant.maxHp;
		if (combatant instanceof Delver && bloodshieldSwordCount > 0 && inCombat) {
			let convertedBlock = excessHealing * bloodshieldSwordCount;
			exports.addBlock(combatant, convertedBlock);
			adventure.updateArtifactStat("Bloodshield Sword", "Block Gained", convertedBlock);
		}
	}

	if (combatant.hp === combatant.maxHp) {
		return `${combatant.getName(adventure.room.enemyIdMap)} was fully healed${excessHealing && inCombat && bloodshieldSwordCount > 0 ? ` (and gained block)` : ""}!`;
	} else {
		return `${combatant.getName(adventure.room.enemyIdMap)} *gained ${healing} hp*.`
	}
}

exports.addBlock = function (combatant, integer) {
	combatant.block += integer;
	return combatant;
}

exports.clearBlock = function (combatant) {
	combatant.block = 0;
	return combatant;
}

/** Checks if adding the modifier inverts exisiting modifiers, increments the (remaining) stacks, then checks if stacks exceed a trigger threshold
 * @param {Combatant} combatant
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Oblivious check
 * @returns {boolean} if the modifier was added (as opposed to being prevented by Oblivious)
 */
exports.addModifier = function (combatant, { name: modifier, stacks: pendingStacks, force = false }) {
	// Oblivious only blocks buffs and debuffs
	if (!("Oblivious" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier))) || force) {
		let inverse = getInverse(modifier);
		let inverseStacks = combatant.modifiers[inverse];
		if (inverseStacks) {
			exports.removeModifier(combatant, { name: inverse, stacks: pendingStacks, force: true });
			if (inverseStacks < pendingStacks) {
				combatant.modifiers[modifier] = pendingStacks - inverseStacks;
			}
		} else {
			if (combatant.modifiers[modifier]) {
				combatant.modifiers[modifier] += pendingStacks;
			} else {
				combatant.modifiers[modifier] = pendingStacks;
			}
		}

		// Trigger threshold: Stagger to Stun
		if (combatant.getModifierStacks("Stagger") >= combatant.staggerThreshold) {
			combatant.modifiers.Stagger -= combatant.staggerThreshold;
			combatant.modifiers.Stun = 1;
			if ("Progress" in combatant.modifiers) {
				combatant.modifiers.Progress = Math.ceil(combatant.getModifierStacks("Progress") * 0.8);
			}
		}

		// Trigger threshold: Progress
		if (combatant.getModifierStacks("Progress") >= 100) {
			combatant.modifiers.Progress -= 100;
			exports.addModifier(combatant, { name: "Power Up", stacks: 100, force: true });
			if ("Stasis" in combatant.modifiers) {
				combatant.modifiers.Stasis++;
			} else {
				combatant.modifiers.Stasis = 1;
			}
		}
		return true;
	} else {
		exports.removeModifier(combatant, { name: "Oblivious", stacks: 1, force: true });
		return false;
	}
}

/** After decrementing a modifier's stacks, delete the modifier's entry in the object
 * @param {Combatant} combatant
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Stasis check (eg buffs/debuffs consuming themselves)
 * @returns {boolean} if the modifier was decremented (as opposed to being prevented by Stasis)
 */
exports.removeModifier = function (combatant, { name: modifier, stacks, force = false }) {
	// Stasis only protects buffs and debuffs
	if (!("Stasis" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier))) || force) {
		if (isNaN(parseInt(stacks)) || stacks >= combatant.modifiers[modifier]) {
			delete combatant.modifiers[modifier];
		} else if (modifier in combatant.modifiers) {
			combatant.modifiers[modifier] -= stacks;
		}
		return true;
	} else {
		exports.removeModifier(combatant, { name: "Stasis", stacks: 1, force: true });
		return false;
	}
}

/** Create a string containing the combatant's current modifiers
 * @param {Combatant} combatant
 * @param {boolean} includeStagger
 * @param {Adventure} adventure
 */
exports.modifiersToString = function (combatant, includeStagger, adventure) {
	let modifiersText = "";
	for (let modifier in combatant.modifiers) {
		if (includeStagger || modifier !== "Stagger") {
			modifiersText += `*${modifier}${isNonStacking(modifier) ? "" : ` x ${combatant.modifiers[modifier]}`}* - ${getModifierDescription(modifier, combatant, adventure)}\n`;
		}
	}
	return modifiersText;
}
