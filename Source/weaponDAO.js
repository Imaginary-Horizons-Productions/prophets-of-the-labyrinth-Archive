const { getEmoji } = require("./elementHelpers.js");
const { getWeaponProperty, buildWeaponDescription } = require("./Weapons/_weaponDictionary");

exports.weaponToEmbedField = function (weaponName, uses) {
	return [
		`${weaponName} ${getEmoji(getWeaponProperty(weaponName, "element"))} (${uses}/${getWeaponProperty(weaponName, "maxUses")})`,
		buildWeaponDescription(weaponName, true)
	];
}
