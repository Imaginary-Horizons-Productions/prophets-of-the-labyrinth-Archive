const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Bow", "*Strike a foe for @{damage} @{element} damage (+@{speedBonus})*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any", "self"]}
	.setUses(10)
	.setDamage(75)
	.setSpeedBonus(10);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure); // result text
}
