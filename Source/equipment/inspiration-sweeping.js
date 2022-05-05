const Equipment = require('../../Classes/Equipment.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Sweeping Inspiration", 1, "Apply @{mod1Stacks} @{mod1} to all allies*\nCritical Hit: Apply @{mod2Stacks} @{mod2} to all allies", "Light", effect, ["Reinforcing Inspiration", "Soothing Inspiration"])
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
