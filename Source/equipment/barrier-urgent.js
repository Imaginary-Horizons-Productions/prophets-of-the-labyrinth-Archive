const Equipment = require('../../Classes/Equipment.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Urgent Barrier", 2, "*Grant an ally @{block} block (+@{speedBonus} speed bonus)*\nCritical Hit: Block x@{critBonus}", "Fire", effect, ["Purifiying Barrier", "Thick Barrier"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(1)
	.setBlock(1000)
	.setSpeedBonus(5);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return ""; // result as text
}
