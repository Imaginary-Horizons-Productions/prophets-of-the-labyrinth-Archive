const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new EquipmentTemplate("Fate Sealing Censer", "Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage", "Also apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}", "Fire", needsLivingTargets(effect))
	.setCategory("Trinket")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Thick Censer", "Tormenting Censor")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }, { name: "Stasis", stacks: 1 }])
	.setDamage(50)
	.setBonus(75) // damage
	.setCost(350)
	.setUses(15);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, slow, stasis], damage, bonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
		damage += bonus;
	}
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		if (isCrit && target.hp > 0) {
			addModifier(target, slow);
			addModifier(target, stasis);
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed and enters Stasis.`;
		} else {
			return damageText;
		}
	});
}
