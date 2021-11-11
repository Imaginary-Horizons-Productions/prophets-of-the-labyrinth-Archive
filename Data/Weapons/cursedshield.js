const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addBlock, removeModifier } = require("../combatantDAO.js");

module.exports = new Weapon("cursedshield", "Pay some hp to use a strong shield (crit: more shield)", "Darkness", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let block = 125;
	if (user.element === element) {
		removeModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		block *= 2;
	}
	addBlock(target, block);
	return dealDamage(user, null, 25, "untyped", adventure).then(damageText => {
		return damageText;
	}); // user pays health
}
