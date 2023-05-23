const { CombatantReference, Adventure } = require("../../../Classes/Adventure");

/** Selects the user of the consumable
 * @param {number} userIndex
 * @param {Adventure} adventure
 */
module.exports.selectSelf = function (userIndex, adventure) {
	return [new CombatantReference("delver", userIndex)];
}
