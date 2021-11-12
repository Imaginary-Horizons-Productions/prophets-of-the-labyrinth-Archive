const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("chameleonsword", "*Strike a foe for @{damage} damage matching your element*\nCritical Hit: Damage x@{critMultiplier}", "untyped", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, user.element, adventure);
}
