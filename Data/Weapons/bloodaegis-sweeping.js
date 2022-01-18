const Weapon = require('../../Classes/Weapon.js');
const { removeModifier, addBlock, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Sweeping Blood Aegis", 2, "*Pay @{hpCost} hp to grant all allies @{block} block*\nCritical Hit: Block x@{critBonus}", "Darkness", effect, ["Spell: Charging Blood Aegis", "Spell: Heavy Blood Aegis"])
	.setTargetingTags({ target: "all", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return dealDamage(user, null, hpCost, true, "untyped", adventure); // user pays health
}
