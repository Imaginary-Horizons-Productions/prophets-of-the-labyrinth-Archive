const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Weapon("Thirsting Battleaxe", 2, "Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage, gain @{healing} hp on kill*\nCritical Hit: Damage x@{critMultiplier}", "Fire", effect, ["Prideful Battleaxe", "Thick Battleaxe"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(75)
	.setHealing(60);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, bonusDamage, critMultiplier, healing } = module.exports;
	if (user.block === 0) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure).then(damageText => {
		if (target.hp < 1) {
			damageText += gainHealth(user, healing, adventure.room.enemyTitles);
		}
		return damageText;
	});
}
