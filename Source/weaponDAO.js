const { getEmoji } = require("./elementHelpers.js");

let getWeaponProperty, buildWeaponDescription;
exports.injectConfig = function (isProduction) {
	({ getWeaponProperty, buildWeaponDescription } = require("./Weapons/_weaponDictionary").injectConfig(isProduction));
	return this;
}

/**
 * Seen in target selection embeds and /inspect-self weapon fields contain nearly all information about the weapon they represent
 *
 * @param {string} weaponName
 * @param {number} uses
 * @returns {string[2]} contents for a message embed field [heading, body]
 */
exports.weaponToEmbedField = function (weaponName, uses) {
	return [
		`${weaponName} ${getEmoji(getWeaponProperty(weaponName, "element"))} (${uses}/${getWeaponProperty(weaponName, "maxUses")})`,
		buildWeaponDescription(weaponName, true)
	];
}
