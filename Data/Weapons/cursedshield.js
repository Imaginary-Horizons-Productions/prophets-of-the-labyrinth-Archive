const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require("../combatantDAO.js");

module.exports = new Weapon("cursedshield", "Pay some hp to use a strong shield (crit: more shield)", "dark", effect)
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let block = 125;
	if (isCrit) {
		block *= 2;
	}
	target.addBlock(block);
	return takeDamage(user, 25, "untyped", adventure); // user pays health
}
