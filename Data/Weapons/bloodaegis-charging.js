const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("Spell: Charging Blood Aegis", "*Pay @{hpCost} hp to grant an ally @{block} block, then gain 25 powerup*\nCritical Hit: Block x@{critMultiplier}", "Darkness", effect, ["Spell: Heavy Blood Aegis", "Spell: Sweeping Blood Aegis"])
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
	addModifier(user, "powerup", 25);
	return dealDamage(user, null, hpCost, "untyped", adventure); // user pays health
}
