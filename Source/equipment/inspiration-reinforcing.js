const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier, addBlock } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Reinforcing Inspiration", "Apply @{mod1Stacks} @{mod1} and @{block} block to an ally", "@{mod2} x@{critBonus}", "Wind", effect, ["Soothing Inspiration", "Sweeping Inspiration"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Power Up", stacks: 50 }])
	.setBlock(25)
	.setCost(350)
	.setUses(5);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp, critPowerUp], block } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critPowerUp);
	} else {
		addModifier(target, powerUp);
	}
	addBlock(target, block);
	return "";
}
