const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sweeping Daggers", "Strike all foes for @{damage} @{element} damage", "Damage x@{critBonus}", "Wind", effect, ["Sharpened Daggers", "Wicked Daggers"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "all", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setCritBonus(3)
	.setDamage(50);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
	return Promise.all(
		targets.map(target => {
			if (target.hp < 1) {
				return "";
			}
			if (user.element === element) {
				addModifier(target, elementStagger);
			}
			if (isCrit) {
				damage *= critBonus;
			}
			return dealDamage(target, user, damage, false, element, adventure);
		})
	).then(results => results.filter(result => Boolean(result)).join(" "));
}
