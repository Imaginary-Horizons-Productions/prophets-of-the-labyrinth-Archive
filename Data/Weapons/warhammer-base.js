const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Warhammer", 1, "*Strike a foe for @{damage} (+@{bonusDamage} if foe is already stunned) @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(100)
	.setBonusDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, bonusDamage, critMultiplier } = module.exports;
	if (target.modifiers.Stun) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
