const { getEmoji } = require("./elementHelpers.js");

let getWeaponProperty, buildWeaponDescription;
exports.injectConfig = function (isProduction) {
	({ getWeaponProperty, buildWeaponDescription } = require("./Weapons/_weaponDictionary").injectConfig(isProduction));
	return this;
}

exports.weaponToEmbedField = function (weaponName, uses) {
	return [
		`${weaponName} ${getEmoji(getWeaponProperty(weaponName, "element"))} (${uses}/${getWeaponProperty(weaponName, "maxUses")})`,
		buildWeaponDescription(weaponName, true)
	];
}
