const Equipment = require('../../Classes/Equipment.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Equipment("Thirsting Battleaxe", 2, "Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage, gain @{healing} hp on kill*\nCritical Hit: Damage x@{critBonus}", "Fire", effect, ["Prideful Battleaxe", "Thick Battleaxe"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(75)
	.setHealing(60);

function effect(target, user, isCrit, adventure) {
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
