const { CombatantReference, Adventure } = require("../../../Classes/Adventure");

/** Selects the user of the consumable
 * @param {number} userIndex
 * @param {Adventure} adventure
 */
module.exports.selectSelf = function (userTeam, userIndex, adventure) {
	if (userTeam === "delver") {
		return [new CombatantReference("delver", userIndex)];
	} else {
		return [new CombatantReference("enemy", userIndex)];
	}

}
