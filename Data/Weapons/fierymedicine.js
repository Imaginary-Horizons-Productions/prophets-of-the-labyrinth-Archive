const Weapon = require('../../Classes/Weapon.js');
const { takeDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("fierymedicine", "Heal a fire element character, damage everyone else (crit: more healing/damage)", "fire", effect)
	.setTargetingTags({ target: "single", team: "any" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let value = 50;
	if (isCrit) {
		value *= 2;
	}
	if (target.element === "fire") {
		value /= 2;
		return gainHealth(target, value, adventure.battleEnemyTitles);
	} else {
		return takeDamage(target, value, element, adventure);
	}
}
