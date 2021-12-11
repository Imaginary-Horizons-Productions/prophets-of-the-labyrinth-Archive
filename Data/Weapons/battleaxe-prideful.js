const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Prideful Battleaxe", 2, "Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "untyped", effect, ["Thick Battleaxe", "Thirsting Battleaxe"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(100)
	.setBonusDamage(100);

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
	return dealDamage(target, user, damage, weaponElement, adventure);
}
