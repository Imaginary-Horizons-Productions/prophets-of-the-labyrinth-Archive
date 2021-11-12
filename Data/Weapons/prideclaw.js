const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("prideclaw", "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "untyped", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(150);

function effect(target, user, isCrit, adventure) {
	let {eFlement: weaponElement, damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, "untyped", adventure);
}
