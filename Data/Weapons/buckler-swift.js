const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Buckler", "*Grant an ally @{block} block, then gain 2 Quicken*\nCritical Hit: Block x@{critMultiplier}", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10)
	.setBlock(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, block, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		block *= critMultiplier;
	}
	addBlock(target, block);
	addModifier(user, "Quicken", 2);
	return "";
}
