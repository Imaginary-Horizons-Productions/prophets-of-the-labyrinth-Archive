const { CombatantReference, Adventure } = require("../../../Classes/Adventure");

/** Selects all foes of the user
 * @param {number} userIndex
 * @param {Adventure} adventure
 * @returns
 */
module.exports.selectAllFoes = function (userIndex, adventure) {
	return adventure.room.enemies.map((enemy, index) => new CombatantReference("enemy", index));
}
