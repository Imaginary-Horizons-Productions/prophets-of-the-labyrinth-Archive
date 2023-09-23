const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Soothing Floating Mist Stance", "Enter a stance that increases Punch stagger by @{bonus} and grants @{mod1Stacks} @{mod1} each round (exit other stances), gain @{mod2Stacks} @{mod2} now", "Gain @{mod1Stacks} @{mod1} now", "Wind", effect)
	.setCategory("Technique")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Regen", stacks: 2 }])
	.setBonus(2) // Punch stagger boost
	.setCost(350)
	.setUses(10);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, displayEvade, floatingMistStance, regen] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, displayEvade);
	}
	removeModifier(user, { name: "Iron Fist Stance", stacks: "all", force: true });
	addModifier(user, floatingMistStance);
	addModifier(user, regen);
	return `${user.getName(adventure.room.enemyIdMap)} enters Floating Mist Stance${isCrit ? " and prepares to Evade" : ""}.`;
}
