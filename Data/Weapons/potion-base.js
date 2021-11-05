const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Unfinished Potion", "Damage a target (crit: more damage)", "untyped", effect, ["Earthen Potion", "Inky Potion", "Watery Potion"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let value = 50;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		value *= 2;
	}
	return dealDamage(target, user, value, element, adventure);
}
