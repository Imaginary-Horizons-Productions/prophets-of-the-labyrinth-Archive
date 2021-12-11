const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier, addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("Guarding Sword", 2, "*Strike a foe for @{damage} @{element} damage, then gain @{block} block and 25 powerup*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, ["Reckless Sword", "Swift Sword"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(75)
	.setBlock(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, block, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	addBlock(user, block);
	addModifier(user, "powerup", 25);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
