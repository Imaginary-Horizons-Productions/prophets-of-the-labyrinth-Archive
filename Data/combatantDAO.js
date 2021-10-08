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

exports.takeDamage = function (combatant, damage, element, adventure) {
	let pendingDamage = Math.ceil(damage);
	let isWeakness = Combatant.getWeaknesses(combatant.element).includes(element);
	if (isWeakness) {
		pendingDamage *= 2;
	}
	let isResistance = Combatant.getResistances(combatant.element).includes(element);
	if (isResistance) {
		pendingDamage = Math.ceil(pendingDamage / 2);
	}
	let blockedDamage = 0;
	if (pendingDamage >= combatant.block) {
		pendingDamage -= combatant.block;
		blockedDamage = combatant.block;
		combatant.block = 0;
	} else {
		combatant.block -= pendingDamage;
		blockedDamage = pendingDamage;
		pendingDamage = 0;
	}
	combatant.hp -= pendingDamage;
	let damageText = ` ${exports.getFullName(combatant, adventure.battleEnemyTitles)} takes ${pendingDamage} damage${blockedDamage > 0 ? ` (${blockedDamage} blocked)` : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
	if (combatant.hp <= 0) {
		if (combatant.team === "ally") {
			combatant.hp = combatant.maxHp;
			adventure.lives -= 1;
			damageText += ` ${exports.getFullName(combatant, adventure.battleEnemyTitles)} has died and been revived. ${adventure.lives} lives remain.`;
		} else {
			combatant.hp = 0;
			damageText += ` ${exports.getFullName(combatant, adventure.battleEnemyTitles)} has died.`;
		}
	}
	return damageText;
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
