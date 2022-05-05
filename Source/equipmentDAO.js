const { getEmoji } = require("./elementHelpers.js");

let getEquipmentProperty, buildEquipmentDescription;
exports.injectConfig = function (isProduction) {
	({ getEquipmentProperty, buildEquipmentDescription } = require("./equipment/_equipmentDictionary").injectConfig(isProduction));
	return this;
}

/**
 * Seen in target selection embeds and /inspect-self equipment fields contain nearly all information about the equipment they represent
 *
 * @param {string} equipmentName
 * @param {number} uses
 * @returns {string[2]} contents for a message embed field [heading, body]
 */
exports.equipmentToEmbedField = function (equipmentName, uses) {
	return [
		`${equipmentName} ${getEmoji(getEquipmentProperty(equipmentName, "element"))} (${uses}/${getEquipmentProperty(equipmentName, "maxUses")})`,
		buildEquipmentDescription(equipmentName, true)
	];
}
