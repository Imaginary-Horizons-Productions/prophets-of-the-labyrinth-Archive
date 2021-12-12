const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Mercurial Bow", 2, "*Strike a foe for @{damage} damage matching the user's element (+@{speedBonus})*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, ["Evasive Bow", "Hunter's Bow"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setCost(350)
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
	return dealDamage(target, user, damage, weaponElement, adventure);
}
