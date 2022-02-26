const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Urgent Buckler", 2, "*Grant an ally @{block} block (+@{speedBonus} speed)*\nCritical Hit: Block x@{critBonus}", "Earth", effect, ["Guarding Buckler", "Heavy Buckler"])
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setBlock(75)
	.setSpeedBonus(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return "";
}
