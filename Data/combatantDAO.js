const Combatant = require("./../Classes/Combatant.js");

exports.takeDamage = function (combatant, damage, element, adventure) {
	let pendingDamage = damage;
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
	let damageText = ` ${combatant.name} takes ${pendingDamage} damage${blockedDamage > 0 ? ` (${blockedDamage} blocked)` : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
	if (combatant.hp <= 0) {
		if (combatant.team === "ally") {
			combatant.hp = combatant.maxHp;
			adventure.lives -= 1;
			damageText += ` ${combatant.name} has died and been revived. ${adventure.lives} lives remain.`;
		} else {
			combatant.hp = 0;
			damageText += ` ${combatant.name} has died.`;
		}
	}
	return damageText;
}

module.exports.gainHealth = (combatant, healing) => {
	combatant.hp += healing;
	if (combatant.hp > combatant.maxHp) {
		combatant.hp = combatant.maxHp;
	}

	if (combatant.hp === combatant.maxHp) {
		return `${combatant.name} was fully healed!`;
	} else {
		return `${combatant.name} gained ${healing} hp.`
	}
}
