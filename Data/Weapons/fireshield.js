const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addBlock, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("fireshield", "*Strike a foe for @{damage} @{element} damage and gain @{block} block*\nCritical Hit: Damage x@{critMultiplier}", "Fire", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5)
	.setDamage(75)
	.setBlock(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, block, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	addBlock(user, block);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
