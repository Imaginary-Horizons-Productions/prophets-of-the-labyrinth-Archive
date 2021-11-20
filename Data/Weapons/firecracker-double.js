const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Double Firecracker", "*Strike 6 random foes for @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Fire", effect, [])
	.setTargetingTags({ target: "random-6", team: "enemy" })
	.setUses(5)
	.setCritMultiplier(2)
	.setDamage(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
