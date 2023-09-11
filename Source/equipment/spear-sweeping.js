const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Sweeping Spear", "Strike all foes for @{damage} @{element} damage", "Also inflict @{mod1Stacks} @{mod1}", "Wind", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "all", team: "enemy" })
	.setSidegrades("Lethal Spear", "Reactive Spear")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, critStagger], damage } = module.exports;
	targets.map(target => {
		if (target.hp < 1) {
			return "";
		}

		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, critStagger);
		}
	})
	return dealDamage(targets, user, damage, false, element, adventure);
}
