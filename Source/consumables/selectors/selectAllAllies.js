const { CombatantReference, Adventure } = require("../../../Classes/Adventure");

/** Selects all allies of the user (including themself)
 * @param {number} userIndex
 * @param {Adventure} adventure
 * @returns
 */
module.exports.selectAllAllies = function (userTeam, userIndex, adventure) {
	if (userTeam === "delver") {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
	} else {
		return adventure.room.enemies.map((enemy, index) => new CombatantReference("enemy", index));
	}
}
