const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("firecracker", "*Strike a random foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Fire", effect, [])
	.setTargetingTags({ target: "random", team: "enemy" })
	.setUses(5)
	.setCritMultiplier(2)
	.setDamage(125);

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
