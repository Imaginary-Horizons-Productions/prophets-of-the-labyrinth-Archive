const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { generateRandomNumber } = require('../../helpers.js');
const { dealDamage, addModifier, getCombatantWeaknesses } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Duelist's Pistol", "Strike a foe for @{damage} (+@{bonus} if only attacker) @{element} damage, give a random ally @{mod1Stacks} @{mod1} if the foe is weak to @{element}", "Damage x@{critBonus}", "Earth", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Double Pistol")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 40 }])
	.setCost(200)
	.setUses(15)
	.setDamage(75)
	.setBonus(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { damage, bonus, critBonus, element, modifiers: [elementStagger, powerUp] } = module.exports;
	const targetIndex = target.findMyIndex(adventure);
	const userIndex = user.findMyIndex(adventure);
	const isLoneAttacker = !adventure.room.moves.some(move => !(move.userReference.team === user.team && move.userReference.index === userIndex) && move.targets.some(moveTarget => moveTarget.team === target.team && moveTarget.index === targetIndex));
	let pendingDamage = damage + (isLoneAttacker ? bonus : 0);
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (getCombatantWeaknesses(target).includes(element)) {
		return dealDamage([target], user, pendingDamage * (isCrit ? critBonus : 1), false, element, adventure).then(damageText => {
			const ally = adventure.delvers[generateRandomNumber(adventure, adventure.delvers.length, "battle")];
			addModifier(ally, powerUp);
			return `${damageText} ${ally.name} was Powered Up!`
		});
	} else {
		return dealDamage([target], user, pendingDamage * (isCrit ? critBonus : 1), false, element, adventure);
	}
}
