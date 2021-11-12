const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("shieldbash", "*Strike a foe for @{element} damage equal to your block*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, critMultiplier } = module.exports;
	let damage = user.block;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
