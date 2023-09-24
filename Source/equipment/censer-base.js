const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new EquipmentTemplate("Censer", "Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage", "Also apply @{mod1Stacks} @{mod1}", "Fire", needsLivingTargets(effect))
	.setCategory("Trinket")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Fate Sealing Censer", "Thick Censer", "Tormenting Censor")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setDamage(50)
	.setBonus(75) // damage
	.setCost(200)
	.setUses(15);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, slow], damage, bonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
		damage += bonus;
	}
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		if (isCrit && target.hp > 0) {
			addModifier(target, slow);
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
		} else {
			return damageText;
		}
	});
}
