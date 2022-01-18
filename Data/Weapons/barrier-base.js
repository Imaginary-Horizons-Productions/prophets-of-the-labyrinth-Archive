const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Barrier", 1, "*Grant an ally @{block} block*\nCritical Hit: Block x@{critBonus}", "Light", effect, ["Purifiying Barrier", "Thick Barrier", "Urgent Barrier"])
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(1)
	.setBlock(1000);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return "";
}
