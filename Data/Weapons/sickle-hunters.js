const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new Weapon("Hunter's Sickle", "Attack an enemy and deal 10% max HP damage, gain gold on a kill (crit: more damage)", "Water", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75 + (0.1 * target.maxHp);
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, user, damage, element, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gold += 15;
			damageText += ` ${getFullName(user, adventure.room.enemyTitles)} harvests 15g of alchemical reagents.`;
		}
		return damageText;
	}); // result text
}
