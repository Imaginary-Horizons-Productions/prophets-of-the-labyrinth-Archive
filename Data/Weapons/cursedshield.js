const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addBlock, removeModifier } = require("../combatantDAO.js");

module.exports = new Weapon("cursedshield", "*Pay @{hpCost} hp to grant an ally @{block} block*\nCritical Hit: Block x@{critMultiplier}", "Darkness", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, block, critMultiplier, hpCost } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		block *= critMultiplier;
	}
	addBlock(target, block);
	return dealDamage(user, null, hpCost, "untyped", adventure); // user pays health
}
