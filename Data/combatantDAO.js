const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const Combatant = require("./../Classes/Combatant.js");

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

exports.dealDamage = function (target, damage, element, adventure) {
	let pendingDamage = Math.ceil(damage);
	let isWeakness = Combatant.getWeaknesses(target.element).includes(element);
	if (isWeakness) {
		pendingDamage *= 2;
	}
	let isResistance = Combatant.getResistances(target.element).includes(element);
	if (isResistance) {
		pendingDamage = Math.ceil(pendingDamage / 2);
	}
	if (!Object.keys(target.modifiers).includes("evade")) {
		let blockedDamage = 0;
		if (pendingDamage >= target.block) {
			pendingDamage -= target.block;
			blockedDamage = target.block;
			target.block = 0;
		} else {
			target.block -= pendingDamage;
			blockedDamage = pendingDamage;
			pendingDamage = 0;
		}
		target.hp -= pendingDamage;
		let damageText = ` ${exports.getFullName(target, adventure.battleEnemyTitles)} takes ${pendingDamage} damage${blockedDamage > 0 ? ` (${blockedDamage} blocked)` : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
		if (target.hp <= 0) {
			if (target.team === "ally") {
				target.hp = target.maxHp;
				adventure.lives -= 1;
				damageText += ` ${exports.getFullName(target, adventure.battleEnemyTitles)} has died and been revived. ${adventure.lives} lives remain.`;
			} else {
				target.hp = 0;
				damageText += ` ${exports.getFullName(target, adventure.battleEnemyTitles)} has died.`;
			}
		}
		return damageText;
	} else {
		target.modifiers["evade"]--;
		if (target.modifiers["evade"] <= 0) {
			delete target.modifiers["evade"];
		}
		return ` ${exports.getFullName(target, adventure.battleEnemyTitles)} evades the attack!`;
	}
}

exports.gainHealth = (combatant, healing, titleObject) => {
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

exports.addBlock = (combatant, integer) => {
	combatant.block = integer;
	return combatant;
}

exports.clearBlock = (combatant) => {
	combatant.block = 0;
	return combatant;
}

exports.addModifier = (combatant, modifierName, value) => {
	combatant.modifiers[modifierName] = value;
	return combatant;
}
