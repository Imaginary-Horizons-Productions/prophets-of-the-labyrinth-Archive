const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Evasive Bow", "*Strike a foe for @{damage} @{element} damage and gain 1 evade (+@{speedBonus})*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, ["Hunter's Bow", "Mercurial Bow"])
	.setTargetingTags({ target: "single", team: "enemy" })
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
	addModifier(user, "evade", 1);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
