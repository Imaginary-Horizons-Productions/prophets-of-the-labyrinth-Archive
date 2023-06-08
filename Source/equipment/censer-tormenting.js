const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Tormenting Censer", "Burn a foe for @{damage} (+@{bonus} if target has debuffs) @{element} damage, duplicate its debuffs", "Also apply @{mod1Stacks} @{mod1}", "Fire", effect, ["Fate Sealing Censer", "Thick Censer"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setDamage(50)
	.setBonus(75) // damage
	.setCost(350)
	.setUses(10);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, slow], damage, bonus } = module.exports;
	for (const modifier in target.modifiers) {
		if (isDebuff(modifier)) {
			addModifier(target, { name: modifier, stacks: 1 });
		}
	}
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
