const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier, addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("Guarding Sword", "*Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage and gain @{block} block*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, ["Charging Sword", "Swift Sword"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(75)
	.setBlock(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, bonusDamage, block, critMultiplier } = module.exports;
	if (user.block === 0) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	addBlock(user, block);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
