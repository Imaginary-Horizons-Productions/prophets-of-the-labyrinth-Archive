const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("fierymedicine", "Heal a fire element character, damage everyone else (crit: more healing/damage)", "fire", effect)
	.setTargetingTags({ target: "single", team: "any" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let value = 50;
	if (user.element === element) {
		value *= 1.5;
	}
	if (isCrit) {
		value *= 2;
	}
	if (target.element === "fire") {
		value /= 2;
		return gainHealth(target, value, adventure.battleEnemyTitles);
	} else {
		return dealDamage(target, value, element, adventure);
	}
}
