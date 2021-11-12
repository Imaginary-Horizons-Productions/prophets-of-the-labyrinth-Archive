const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Wicked Dagger", "*Strike a foe for @{damage} (+@{bonusDamage} if foe has 0 block) @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setCritMultiplier(3)
	.setDamage(75)
	.setBonusDamage(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, bonusDamage, critMultiplier } = module.exports;
	if (target.block === 0) {
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
