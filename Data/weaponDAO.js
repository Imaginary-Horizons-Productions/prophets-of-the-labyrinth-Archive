const { getWeaponProperty } = require("./Weapons/_weaponDictionary");

exports.weaponToEmbedField = function (weaponName, uses) {
	return [
		`${weaponName} (${uses}/${getWeaponProperty(weaponName, "maxUses")})`,
		`${getWeaponProperty(weaponName, "description").replace("@{element}", getWeaponProperty(weaponName, "element"))
			.replace("@{critMultiplier}", getWeaponProperty(weaponName, "critMultiplier"))
			.replace("@{damage}", getWeaponProperty(weaponName, "damage"))
			.replace("@{bonusDamage}", getWeaponProperty(weaponName, "bonusDamage"))
			.replace("@{block}", getWeaponProperty(weaponName, "block"))
			.replace("@{hpCost}", getWeaponProperty(weaponName, "hpCost"))
			.replace("@{healing}", getWeaponProperty(weaponName, "healing"))
			.replace("@{speedBonus}", getWeaponProperty(weaponName, "speedBonus"))}`
	];
}
