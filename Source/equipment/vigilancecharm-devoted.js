const Equipment = require('../../Classes/Equipment.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Devoted Vigilance Charm", 2, "*Grant ally @{mod1Stacks} @{mod1}*\nCritical Hit: Grant ally @{mod2Stacks} @{mod2}", "Earth", effect, ["Persistent Vigilance Charm", "Warding Vigilance Charm"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setCost(350)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance, critVigilance] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critVigilance);
	} else {
		addModifier(user, vigilance);
	}
	return ""; // result as text
}
