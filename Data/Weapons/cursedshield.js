const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addBlock } = require("../combatantDAO.js");

module.exports = new Weapon("cursedshield", "Pay some hp to use a strong shield (crit: more shield)", "dark", effect)
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let block = 125;
	if (user.element === element) {
		block *= 1.5;
	}
	if (isCrit) {
		block *= 2;
	}
	addBlock(target, block);
	return dealDamage(user, 25, "untyped", adventure); // user pays health
}
