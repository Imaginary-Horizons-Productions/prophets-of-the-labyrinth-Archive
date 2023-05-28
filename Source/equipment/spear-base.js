const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Spear", "Strike a foe for @{damage} @{element} damage", "Also inflict @{mod1Stacks} @{mod1}", "Wind", effect, ["Lethal Spear", "Reactive Spear", "Sweeping Spear"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(100);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, critStagger], damage } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
