const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require("../combatantDAO.js");

module.exports = new Weapon("Sharpened Dagger", 2, "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, ["Sweeping Daggers", "Wicked Dagger"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setCritMultiplier(3)
	.setDamage(100);

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
