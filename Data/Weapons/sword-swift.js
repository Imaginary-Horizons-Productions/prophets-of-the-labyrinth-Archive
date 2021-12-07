const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Sword", "*Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage and gain 2 Quicken*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, ["Charging Sword", "Guarding Sword"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, bonusDamage, critMultiplier } = module.exports;
	if (user.block === 0) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	addModifier(user, "Quicken", 2);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
