const { CombatantReference, Adventure } = require("../../../Classes/Adventure");

/** Selects all foes of the user
 * @param {number} userIndex
 * @param {Adventure} adventure
 * @returns
 */
module.exports.selectAllFoes = function (userTeam, userIndex, adventure) {
	if (userTeam === "delver") {
		return adventure.room.enemies.map((enemy, index) => new CombatantReference("enemy", index));
	} else {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
	}
}
