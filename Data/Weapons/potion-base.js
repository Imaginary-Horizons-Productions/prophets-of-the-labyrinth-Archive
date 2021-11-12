const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Unfinished Potion", "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Water", effect, ["Earthen Potion", "Inky Potion", "Watery Potion"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5)
	.setDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage: value, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		value *= critMultiplier;
	}
	return dealDamage(target, user, value, weaponElement, adventure);
}
