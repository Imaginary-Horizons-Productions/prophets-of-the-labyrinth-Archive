const { calculateTotalSpeed, removeModifier } = require("../Source/combatantDAO");

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

	calculateMoveSpeed(combatant) {
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
