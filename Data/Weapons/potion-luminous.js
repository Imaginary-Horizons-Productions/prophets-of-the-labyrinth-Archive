const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Luminous Potion", "Heal a light element combatant, damage everyone else (crit: more healing/damage)", "light", effect, [])
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
	if (target.element === "light") {
		value /= 2;
		return gainHealth(target, value, adventure.room.enemyTitles);
	} else {
		return dealDamage(target, user, value, element, adventure);
	}
}
