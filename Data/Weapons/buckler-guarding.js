const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Guarding Buckler", 2, "*Grant @{block} block to an ally and yourself*\nCritical Hit: Block x@{critBonus}", "Earth", effect, ["Heavy Buckler", "Urgent Buckler"])
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setBlock(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, elementStagger);
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addBlock(user, block);
	return "";
}
