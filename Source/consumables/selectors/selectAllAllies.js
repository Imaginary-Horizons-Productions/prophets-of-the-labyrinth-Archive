const { CombatantReference, Adventure } = require("../../../Classes/Adventure");

/** Selects all allies of the user (including themself)
 * @param {number} userIndex
 * @param {Adventure} adventure
 * @returns
 */
module.exports.selectAllAllies = function (userIndex, adventure) {
	return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
}
