const { getWeaponProperty } = require("./Weapons/_weaponDictionary");

exports.weaponToEmbedField = function (weaponName, uses) {
	let description = getWeaponProperty(weaponName, "description").replace("@{element}", getWeaponProperty(weaponName, "element"))
		.replace("@{critMultiplier}", getWeaponProperty(weaponName, "critMultiplier"))
		.replace("@{damage}", getWeaponProperty(weaponName, "damage"))
		.replace("@{bonusDamage}", getWeaponProperty(weaponName, "bonusDamage"))
		.replace("@{block}", getWeaponProperty(weaponName, "block"))
		.replace("@{hpCost}", getWeaponProperty(weaponName, "hpCost"))
		.replace("@{healing}", getWeaponProperty(weaponName, "healing"))
		.replace("@{speedBonus}", getWeaponProperty(weaponName, "speedBonus"));
	getWeaponProperty(weaponName, "modifiers").forEach((modifier, index) => {
		description = description.replace(new RegExp(`@{mod${index}}`, "g"), modifier.name)
			.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
	})
	return [
		`${weaponName} (${uses}/${getWeaponProperty(weaponName, "maxUses")})`,
		description
	];
}
