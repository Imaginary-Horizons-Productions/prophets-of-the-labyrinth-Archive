const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, calculateTotalSpeed, getFullName } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Reactive Spear", "Strike a foe for @{damage} (+@{bonus} if foe went first) @{element} damage", "Also inflict @{mod1Stacks} @{mod1}", "Fire", effect, ["Lethal Spear", "Sweeping Spear"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100)
	.setBonus(75); // damage

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, critStagger], damage, bonus } = module.exports;
	if (calculateTotalSpeed(target) > calculateTotalSpeed(user)) {
		damage += bonus;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
