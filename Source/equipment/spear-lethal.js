const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Lethal Spear", "Strike a foe for @{damage} @{element} damage", "Damage x@{critBonus}, also inflict @{mod1Stacks} @{mod1}", "Fire", effect, ["Reactive Spear", "Sweeping Spear"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, critStagger], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
		addModifier(target, critStagger);
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
