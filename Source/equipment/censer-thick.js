const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new EquipmentTemplate("Thick Censer", "Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage", "Also apply @{mod1Stacks} @{mod1}", "Fire", effect, ["Tormenting Censor"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setDamage(50)
	.setBonus(75) // damage
	.setCost(350)
	.setUses(20);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, slow], damage, bonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
		damage += bonus;
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	return dealDamage(target, user, damage, false, element, adventure); // result text
}
