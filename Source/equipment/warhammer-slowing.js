const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Slowing Warhammer", "Strike a foe for @{damage} (+@{bonus} if foe is already stunned) @{element} damage and inflict @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Earth", effect, ["Piercing Warhammer"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonus(75); // damage

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, slow], damage, bonus, critBonus } = module.exports;

	if (target.getModifierStacks("Stun") > 0) {
		damage += bonus;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(target, slow);
	return dealDamage(target, user, damage, false, element, adventure);
}
