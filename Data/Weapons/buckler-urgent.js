const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Urgent Buckler", "*Grant an ally @{block} block (+@{speedBonus} speed)*\nCritical Hit: Block x@{critMultiplier}", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10)
	.setBlock(75)
	.setSpeedBonus(10);

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
