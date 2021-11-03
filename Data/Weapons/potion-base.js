const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Unfinished Potion", "Damage a target (crit: more damage)", "untyped", effect, ["Fiery Potion", "Windy Potion", "Luminous"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let value = 50;
	if (user.element === element) {
		value *= 1.5;
	}
	if (isCrit) {
		value *= 2;
	}
	return dealDamage(target, user, value, element, adventure);
}
