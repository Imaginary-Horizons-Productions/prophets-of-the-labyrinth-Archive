const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Mercurial Firecracker", "*Strike 3 random foes for @{damage} damage matching the user's element*\nCritical Hit: Damage x@{critMultiplier}", "Fire", effect, ["Double Firecracker", "Toxic Firecracker"])
	.setTargetingTags({ target: "random-3", team: "enemy" })
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
	return dealDamage(target, user, damage, user.element, adventure);
}
