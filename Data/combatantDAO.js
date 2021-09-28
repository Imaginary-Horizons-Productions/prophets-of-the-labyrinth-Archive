const Combatant = require("./../Classes/Combatant.js");

exports.takeDamage = function (combatant, damage, element, adventure) { //TODO #27 implement blocking
	let isWeakness = Combatant.getWeaknesses(combatant.element).includes(element);
	let isResistance = Combatant.getResistances(combatant.element).includes(element);
	combatant.hp -= Math.ceil(damage * (isWeakness ? 2 : 1) * (isResistance ? 0.5 : 1));
	let damageText = ` ${combatant.name} takes ${damage}${isWeakness ? " **x 2**" : ""}${isResistance ? " **÷ 2**" : ""} damage.`;
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
