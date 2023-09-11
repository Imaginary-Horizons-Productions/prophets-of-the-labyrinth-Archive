module.exports = class Archetype {
	constructor(nameInput, predictFunction, miniPredictFunction) {
		this.name = nameInput;
		this.predict = predictFunction;
		this.miniPredict = miniPredictFunction;
	}
	maxHp = 300;
	speed = 100;
	element = "Untyped";
	signatureEquipment = [];

	setHp(integer) {
		this.maxHp = integer;
		return this;
	}

	setSpeed(integer) {
		this.speed = integer;
		return this;
	}

	setElement(elementLabel) {
		this.element = elementLabel;
		return this;
	}

	setDescription(text) {
		this.description = text;
		return this;
	}

	/** Set athe archetype's signature equipment by name then return the archetype via builder pattern
	 * @param {string[]} equipmentNames
	 * @returns
	 */
	setSignatureEquipment(equipmentNames) {
		this.signatureEquipment = equipmentNames;
		return this;
	}
}
