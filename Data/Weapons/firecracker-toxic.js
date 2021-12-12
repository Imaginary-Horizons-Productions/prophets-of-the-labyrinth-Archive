const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Toxic Firecracker", 2, "*Strike 3 random foes applying 3 Poison and @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Fire", effect, ["Double Firecracker", "Mercurial Firecracker"])
	.setTargetingTags({ target: "random-3", team: "enemy" })
	.setCost(350)
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
	addModifier(target, "Poison", 3);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
