const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Lethal Spear", "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Inflict 1 Stagger and damage x@{critMultiplier}", "Light", effect, ["Reactive Spear", "Sweeping Spear"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
		addModifier(target, "Stagger", 1);
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
