const { calculateTotalSpeed, removeModifier } = require("../Data/combatantDAO");

module.exports = class Move {
	constructor() {
		this.name = "";
		this.speed = 0;
		this.isCrit = false;
		this.userTeam = ""; //TODO #76 convert to array to support joint/combo moves
		this.userIndex = "";
		this.targets = [];
	}

	setSpeed(combatant) {
		this.speed = calculateTotalSpeed(combatant);
		removeModifier(combatant, { name: "Slow", stacks: 1 });
		removeModifier(combatant, { name: "Quicken", stacks: 1 });
		return this;
	}

	setIsCrit(boolean) {
		this.isCrit = boolean;
		return this;
	}

	setMoveName(weaponNameInput) {
		this.name = weaponNameInput;
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
