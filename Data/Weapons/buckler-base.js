const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Buckler", 1, "*Grant an ally @{block} block*\nCritical Hit: Block x@{critMultiplier}", "Earth", effect, ["Guarding Buckler", "Heavy Buckler", "Urgent Buckler"])
	.setTargetingTags({ target: "single", team: "ally" })
	.setCost(200)
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
	return "";
}
