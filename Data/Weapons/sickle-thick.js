const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Thick Sickle", "*Strike a foe for @{damage} (+10% foe max hp) @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Water", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(20)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, critMultiplier } = module.exports;
	damage += (0.1 * target.maxHp);
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure); // result text
}
