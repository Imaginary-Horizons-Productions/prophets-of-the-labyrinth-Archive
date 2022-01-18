const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const { getInverse, isNonStacking, getModifierDescription } = require("./Modifiers/_modifierDictionary.js");
const { getWeaknesses, getResistances } = require("./elementHelpers.js");

exports.getFullName = function (combatant, titleObject) {
	if (combatant instanceof Enemy) {
		if (titleObject[combatant.name] > 1) {
			return `${combatant.name} ${combatant.title}`;
		} else {
			return combatant.name;
		}
	} else if (combatant instanceof Delver) {
		return `${combatant.name} the ${combatant.title}`;
	}
}

exports.calculateTotalSpeed = function (combatant) {
	let totalSpeed = combatant.speed + combatant.roundSpeed + combatant.actionSpeed;
	if (Object.keys(combatant.modifiers).includes("Slow")) {
		totalSpeed /= 2;
	}
	if (Object.keys(combatant.modifiers).includes("Quicken")) {
		totalSpeed *= 2;
	}
	return Math.ceil(totalSpeed);
}

exports.dealDamage = async function (target, user, damage, isUnblockable, element, adventure) {
	let targetName = exports.getFullName(target, adventure.room.enemyTitles);
	let targetModifiers = Object.keys(target.modifiers);
	if (!targetModifiers.includes(`${element} Absorb`)) {
		if (!targetModifiers.includes("Evade") || isUnblockable) {
			let pendingDamage = damage + (user?.modifiers["Power Up"] || 0);
			if (targetModifiers.includes("Exposed")) {
				pendingDamage *= 1.5;
			}
			let isWeakness = getWeaknesses(target.element).includes(element);
			if (isWeakness) {
				pendingDamage *= 2;
			}
			let isResistance = getResistances(target.element).includes(element);
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
			target.hp -= pendingDamage;
			let damageText = ` ${targetName} takes *${pendingDamage} damage*${blockedDamage > 0 ? ` (${blockedDamage} blocked)` : ""}${element === "Poison" ? " from Poison" : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
			if (targetModifiers.includes("Curse of Midas")) {
				let midasGold = Math.floor(pendingDamage / 10);
				adventure.room.loot.gold += midasGold;
				damageText += ` ${midasGold} gold scatters about the room.`;
			}
			if (target.hp <= 0) {
				if (target.team === "ally") {
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
		return ` ${exports.gainHealth(target, damage, adventure.room.enemyTitles)}`;
	}
}

exports.gainHealth = function (combatant, healing, titleObject) {
	combatant.hp += healing;
	if (combatant.hp > combatant.maxHp) {
		combatant.hp = combatant.maxHp;
	}

	if (combatant.hp === combatant.maxHp) {
		return `${exports.getFullName(combatant, titleObject)} was fully healed!`;
	} else {
		return `${exports.getFullName(combatant, titleObject)} *gained ${healing} hp*.`
	}
}

exports.addBlock = function (combatant, integer) {
	combatant.block = integer;
	return combatant;
}

exports.clearBlock = function (combatant) {
	combatant.block = 0;
	return combatant;
}

exports.addModifier = function (combatant, { name: modifier, stacks }) {
	let pendingStacks = stacks;
	let inverse = getInverse(modifier);
	let inverseStacks = combatant.modifiers[inverse];
	if (inverseStacks) {
		exports.removeModifier(combatant, inverse, pendingStacks);
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

	// Check if Stagger becomes Stun
	if (combatant.modifiers?.Stagger >= combatant.staggerThreshold) {
		combatant.modifiers.Stagger -= combatant.staggerThreshold;
		combatant.modifiers.Stun = 1;
	}
	return combatant;
}

exports.removeModifier = function (combatant, { name: modifier, stacks }) {
	if (combatant.modifiers[modifier]) {
		combatant.modifiers[modifier] -= stacks;
	}
	if (stacks < 0 || combatant.modifiers[modifier] <= 0) {
		delete combatant.modifiers[modifier];
	}
	return combatant;
}

exports.modifiersToString = function (combatant) {
	let modifiersText = "";
	for (let modifier in combatant.modifiers) {
		modifiersText += `*${modifier}${isNonStacking(modifier) ? "" : ` x ${combatant.modifiers[modifier]}`}* - ${getModifierDescription(modifier, combatant)}\n`;
	}
	return modifiersText;
}
