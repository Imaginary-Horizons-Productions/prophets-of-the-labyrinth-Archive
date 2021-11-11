const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier, addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("Sword", "Deal additional damage to a target if not blocking, then gain Block (crit: more damage)", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	if (user.block === 0) {
		damage = 150;
	}
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
	}
	addBlock(user, 75);
	return dealDamage(target, user, damage, element, adventure);
}
