const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Hunter's Certain Victory", "Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1} (@{bonus}g on kill); pay HP for your @{mod1}", "Damage x@{critBonus}", "Earth", effect, ["Lethal Certain Victory", "Reckless Certain Victory"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonus(15);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, powerUp], damage, bonus: bounty, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, false, element, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gainGold(bounty);
			damageText += ` ${getFullName(user, adventure.room.enemyTitles)} gains ${bounty}g of victory spoils.`;
		}
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${damageText}`;
	});
}
