const { calculateTotalSpeed: calculateTotalSpeed, removeModifier } = require("../Source/combatantDAO");
const Delver = require("./Delver");
const Enemy = require("./Enemy");

module.exports = class Move {
	constructor() {
		this.name = "";
		this.type = "";
		this.speed = 0;
		this.isCrit = false;
		this.userTeam = ""; //TODO #76 convert to array to support joint/combo moves
		this.userIndex = "";
		this.targets = [];
	}

	setMoveName(moveName) {
		this.name = moveName;
		return this;
	}

	/** Move type determines which resource to deplete, among other things
	 * @param {"equip" | "consumable" | "action"} typeEnum
	 * @returns {Move}
	 */
	setType(typeEnum) {
		this.type = typeEnum;
		return this;
	}

	/** In addition to containing logic for enemy speed mechanics, this function also consumes a stack of Quicken and Slow
	 * @param {Delver | Enemy} combatant
	 * @returns {Move}
	 */
	onSetMoveSpeed(combatant) {
		this.speed = calculateTotalSpeed(combatant);
		removeModifier(combatant, { name: "Slow", stacks: 1, force: true });
		removeModifier(combatant, { name: "Quicken", stacks: 1, force: true });
		return this;
	}

	setIsCrit(boolean) {
		this.isCrit = boolean;
		return this;
	}

	setUser(team, index) {
		this.userTeam = team;
		this.userIndex = index;
		return this;
	}

	addTarget(team, index) {
		this.targets.push({ team, index });
		return this;
	}
}
