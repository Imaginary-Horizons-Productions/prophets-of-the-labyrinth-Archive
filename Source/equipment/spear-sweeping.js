const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Sweeping Spear", "Strike all foes for @{damage} @{element} damage", "Also inflict @{mod1Stacks} @{mod1}", "Wind", effect, ["Lethal Spear", "Reactive Spear"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "all", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, critStagger], damage } = module.exports;
	return Promise.all(
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
			return dealDamage(target, user, damage, false, element, adventure);
		})
	).then(results => results.filter(result => Boolean(result)).join(" "));
}
