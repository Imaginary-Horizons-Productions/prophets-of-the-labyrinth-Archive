const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, gainHealth, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Thirsting Battleaxe", "Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage, gain @{healing} hp on kill", "Damage x@{critBonus}", "Fire", effect, ["Prideful Battleaxe", "Thick Battleaxe"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(50)
	.setBonusDamage(100)
	.setHealing(60);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger], damage, bonusDamage, critBonus, healing } = module.exports;
	if (user.block === 0) {
		damage += bonusDamage;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure).then(damageText => {
		if (target.hp < 1) {
			damageText += gainHealth(user, healing, adventure);
		}
		return damageText;
	});
}
