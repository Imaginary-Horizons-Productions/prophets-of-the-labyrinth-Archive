const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Thick Barrier", "*Grant an ally @{block} block*\nCritical Hit: Block x@{critMultiplier}", "Light", effect, ["Purifiying Barrier", "Urgent Barrier"])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(2)
	.setBlock(1000);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, block, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		block *= critMultiplier;
	}
	addBlock(target, block);
	return ""; // result as text
}
