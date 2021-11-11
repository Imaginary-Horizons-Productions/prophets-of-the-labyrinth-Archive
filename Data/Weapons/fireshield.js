const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addBlock, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("fireshield", "Defend yourself while bashing a target with a flaming shield (crit: more damage)", "Fire", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	let block = 50;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
	}
	addBlock(user, block);
	return dealDamage(target, user, damage, element, adventure).then(damageText => {
		return damageText;
	});
}
