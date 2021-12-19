const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("Spell: Sweeping Blood Aegis", 2, "*Pay @{hpCost} hp to grant all allies @{block} block*\nCritical Hit: Block x@{critMultiplier}", "Darkness", effect, ["Spell: Charging Blood Aegis", "Spell: Heavy Blood Aegis"])
	.setTargetingTags({ target: "all", team: "ally" })
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(100);

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
