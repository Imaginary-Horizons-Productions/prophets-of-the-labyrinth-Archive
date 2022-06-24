const Equipment = require('../../Classes/Equipment.js');
const { addModifier, removeModifier, addBlock } = require('../combatantDAO.js');

module.exports = new Equipment("Warding Vigilance Charm", 2, "*Gain @{mod1Stacks} @{mod1} and @{block} block*\nCritical Hit: Gain @{mod2Stacks} @{mod2} and Block x@{critBonus}", "Earth", effect, ["Persistent Vigilance Charm", "Warding Vigilance Charm"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setCost(350)
	.setBlock(60)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance, critVigilance], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critVigilance);
		block *= critBonus;
	} else {
		addModifier(user, vigilance);
	}
	addBlock(user,block)
	return ""; // result as text
}
