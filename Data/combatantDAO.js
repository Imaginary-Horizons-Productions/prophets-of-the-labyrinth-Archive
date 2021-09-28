exports.takeDamage = function (combatant, damage, adventure) { //TODO #27 implement blocking
	combatant.hp -= damage;
	let damageText = ` ${combatant.name} takes ${damage} damage.`;
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
