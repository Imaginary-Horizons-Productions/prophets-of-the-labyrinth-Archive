const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const Combatant = require("./../Classes/Combatant.js");
const { getInverse, isNonStacking, getModifierDescription } = require("./Modifiers/_modifierDictionary.js");

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

exports.dealDamage = async function (target, user, damage, element, adventure) {
	if (target.hp > 0) {
		if (!Object.keys(target.modifiers).includes("evade")) {
			let pendingDamage = damage + (user?.modifiers["powerup"] || 0);
			let isWeakness = Combatant.getWeaknesses(target.element).includes(element);
			if (isWeakness) {
				pendingDamage *= 2;
			}
			let isResistance = Combatant.getResistances(target.element).includes(element);
			if (isResistance) {
				pendingDamage = pendingDamage / 2;
			}
			pendingDamage = Math.ceil(pendingDamage);
			let blockedDamage = 0;
			if (element !== "Poison") {
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
			let damageText = ` ${exports.getFullName(target, adventure.room.enemyTitles)} takes ${pendingDamage} damage${blockedDamage > 0 ? ` (${blockedDamage} blocked)` : ""}${element === "Poison" ? " from Poison" : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
			if (target.hp <= 0) {
				if (target.team === "ally") {
					target.hp = target.maxHp;
					adventure.lives -= 1;
					damageText += ` ${exports.getFullName(target, adventure.room.enemyTitles)} has died and been revived. ${adventure.lives} lives remain.`;
				} else {
					target.hp = 0;
					damageText += ` ${exports.getFullName(target, adventure.room.enemyTitles)} has died.`;
				}
			}
			return damageText;
		} else {
			target.modifiers["evade"]--;
			if (target.modifiers["evade"] <= 0) {
				delete target.modifiers["evade"];
			}
			return ` ${exports.getFullName(target, adventure.room.enemyTitles)} evades the attack!`;
		}
	} else {
		return ` ${exports.getFullName(target, adventure.room.enemyTitles)} was already dead!`;
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
		return `${exports.getFullName(combatant, titleObject)} gained ${healing} hp.`
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

exports.addModifier = function (combatant, modifierName, value) {
	let pendingStacks = value;
	let inverse = getInverse(modifierName);
	let inverseStacks = combatant.modifiers[inverse];
	if (inverseStacks) {
		exports.removeModifier(combatant, inverse, pendingStacks);
		if (inverseStacks < pendingStacks) {
			combatant.modifiers[modifierName] = pendingStacks - inverseStacks;
		}
	} else {
		if (combatant.modifiers[modifierName]) {
			combatant.modifiers[modifierName] += pendingStacks;
		} else {
			combatant.modifiers[modifierName] = pendingStacks;
		}
	}

	// Check if Stagger becomes Stun
	if (combatant.modifiers?.Stagger >= combatant.staggerThreshold) {
		combatant.modifiers.Stagger -= combatant.staggerThreshold;
		combatant.modifiers.Stun = 1;
	}
	return combatant;
}

exports.removeModifier = function (combatant, modifierName, value) {
	if (combatant.modifiers[modifierName]) {
		combatant.modifiers[modifierName] -= value;
	}
	if (value < 0 || combatant.modifiers[modifierName] <= 0) {
		delete combatant.modifiers[modifierName];
	}
	return combatant;
}

exports.modifiersToString = function (combatant) {
	let modifiersText = "";
	for (let modifier in combatant.modifiers) {
		modifiersText += `*${modifier}${isNonStacking(modifier) ? "" : ` x ${combatant.modifiers[modifier]}`}* - ${getModifierDescription(modifier)}\n`;
	}
	return modifiersText;
}
