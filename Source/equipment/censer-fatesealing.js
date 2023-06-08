const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new EquipmentTemplate("Fate Sealing Censer", "Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage", "Also apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}", "Fire", effect, ["Thick Censer", "Tormenting Censor"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }, { name: "Stasis", stacks: 1 }])
	.setDamage(50)
	.setBonus(75) // damage
	.setCost(350)
	.setUses(10);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, slow, stasis], damage, bonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
		damage += bonus;
	}
	if (isCrit) {
		addModifier(target, slow);
		addModifier(target, stasis);
	}
	return dealDamage(target, user, damage, false, element, adventure); // result text
}
