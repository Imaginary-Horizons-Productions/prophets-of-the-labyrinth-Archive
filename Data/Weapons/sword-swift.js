const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Sword", "*Strike a foe for @{damage} @{element} damage, then gain 2 Quicken and 25 powerup*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, ["Guarding Sword", "Reckless Sword"])
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
	addModifier(user, "Quicken", 2);
	addModifier(user, "powerup", 25);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
