// Template for combatant buffs and debuffs
module.exports = class Modifier {
	constructor(nameInput, turnDecrementInput) {
		this.name = nameInput;
		this.turnDecrement = turnDecrementInput;
	}
	description = "";
	value = 0;
	isBuff = true;
	isDebuff = true;
	isNonStacking = false;
	inverse = "";

	setDescription(text) {
		this.description = text;
		return this;
	}

	setIsBuff(boolean) {
		this.isBuff = boolean;
		return this;
	}

	setIsDebuff(boolean) {
		this.isDebuff = boolean;
		return this;
	}

	setIsNonStacking(boolean) {
		this.isNonStacking = boolean;
		return this;
	}

	setInverse(modifierName) {
		this.inverse = modifierName;
		return this;
	}
}
