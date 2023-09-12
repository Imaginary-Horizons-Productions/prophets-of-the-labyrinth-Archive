const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { generateRandomNumber } = require('../../helpers.js');
const { dealDamage, addModifier, getCombatantWeaknesses } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Pistol", "Strike a foe for @{damage} @{element} damage, give a random ally @{mod1Stacks} @{mod1} if the foe is weak to @{element}", "Damage x@{critBonus}", "Earth", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Double Pistol")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 40 }])
	.setCost(200)
	.setUses(15)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { damage, critBonus, element, modifiers: [elementStagger, powerUp] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (getCombatantWeaknesses(target).includes(element)) {
		return dealDamage([target], user, damage * (isCrit ? critBonus : 1), false, element, adventure).then(damageText => {
			const ally = adventure.delvers[generateRandomNumber(adventure, adventure.delvers.length, "battle")];
			addModifier(ally, powerUp);
			return `${damageText} ${ally.name} was Powered Up!`
		});
	} else {
		return dealDamage([target], user, damage * (isCrit ? critBonus : 1), false, element, adventure);
	}
}
