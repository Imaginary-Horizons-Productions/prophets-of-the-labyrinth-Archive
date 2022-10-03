const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sweeping Inspiration", "Apply @{mod1Stacks} @{mod1} to all allies*\nCritical Hit: Apply @{mod2Stacks} @{mod2} to all allies", "Wind", effect, ["Reinforcing Inspiration", "Soothing Inspiration"])
	.setCategory("Spell")
	.setTargetingTags({ target: "all", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Power Up", stacks: 50 }])
	.setCost(200)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp, critPowerUp] } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critPowerUp);
	} else {
		addModifier(target, powerUp);
	}
	return "";
}
