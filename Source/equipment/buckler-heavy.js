const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Heavy Buckler", "Grant an ally @{block} block and gain @{mod1Stacks} @{mod1}", "Block x@{critBonus}", "Earth", effect, ["Devoted Buckler", "Guarding Buckler"])
	.setCategory("Armor")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setBlock(125);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addModifier(user, powerUp);
	return "";
}
