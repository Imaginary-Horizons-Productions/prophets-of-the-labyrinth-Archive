const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, gainHealth, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Flanking Life Drain", "Strike a foe for @{damage} @{element} damage and inflict @{mod1Stacks} @{mod1}, then gain @{healing} hp", "Healing x@{critBonus}", "Water", effect, ["Reactive Life Drain", "Urgent Life Drain"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setHealing(25);

async function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, exposed], damage, healing, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		healing *= critBonus;
	}
	let damageText = await dealDamage(target, user, damage, false, element, adventure);
	addModifier(target, exposed);
	return `${damageText} ${gainHealth(user, healing, adventure)}`;
}
