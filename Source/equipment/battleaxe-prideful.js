const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Prideful Battleaxe", "Strike a foe for @{damage} @{element} damage, but gain @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Untyped", effect, ["Thick Battleaxe", "Thirsting Battleaxe"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(175);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, exposed], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, exposed);
	return dealDamage(target, user, damage, false, element, adventure);
}
