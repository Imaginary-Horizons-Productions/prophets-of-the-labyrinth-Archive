const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Guarding Buckler", "*Grant @{block} block to an ally and yourself*\nCritical Hit: Block x@{critMultiplier}", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10)
	.setBlock(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, block, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, "Stagger", 1);
		removeModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		block *= critMultiplier;
	}
	addBlock(target, block);
	addBlock(user, block);
	return "";
}
