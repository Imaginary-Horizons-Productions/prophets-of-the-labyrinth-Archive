const Weapon = require('../../Classes/Weapon.js');
const { removeModifier, addBlock, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Blood Aegis", 1, "*Pay @{hpCost} hp to grant an ally @{block} block*\nCritical Hit: Block x@{critMultiplier}", "Darkness", effect, ["Spell: Charging Blood Aegis", "Spell: Heavy Blood Aegis", "Spell: Sweeping Blood Aegis"])
	.setTargetingTags({ target: "single", team: "ally" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], block, critMultiplier, hpCost } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critMultiplier;
	}
	addBlock(target, block);
	return dealDamage(user, null, hpCost, "untyped", adventure); // user pays health
}
