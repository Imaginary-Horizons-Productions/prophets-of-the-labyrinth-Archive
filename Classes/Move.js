const { CombatantReference } = require("./Adventure");
const Delver = require("./Delver");
const Enemy = require("./Enemy");
const { calculateTotalSpeed, removeModifier } = require("../Source/combatantDAO");

module.exports.Move = class {
	constructor() {
		this.name = "";
		this.type = "";
		this.speed = 0;
		this.isCrit = false;
		this.userReference; //TODO #76 convert to array to support joint/combo moves
		/** @type {CombatantReference[]} */
		this.targets = [];
	}

	setMoveName(moveName) {
		this.name = moveName;
		return this;
	}

	/** Move type determines which resource to deplete, among other things
	 * @param {"equip" | "consumable" | "action"} typeEnum
	 */
	setType(typeEnum) {
		this.type = typeEnum;
		return this;
	}

	/** In addition to containing logic for enemy speed mechanics, this function also consumes a stack of Quicken and Slow
	 * @param {Delver | Enemy} combatant
	 */
	onSetMoveSpeed(combatant) {
		// DESIGN SPACE: if enemy.lookupName has static speed, or is always faster than a delver, etc, put that logic here
		this.speed = calculateTotalSpeed(combatant);
		removeModifier(combatant, { name: "Slow", stacks: 1, force: true });
		removeModifier(combatant, { name: "Quicken", stacks: 1, force: true });
		return this;
	}

	setIsCrit(boolean) {
		this.isCrit = boolean;
		return this;
	}

	/** @param {CombatantReference} reference */
	setUser(reference) {
		this.userReference = reference;
		return this;
	}

	/** @param {CombatantReference} reference */
	addTarget(reference) {
		this.targets.push(reference);
		return this;
	}
};
