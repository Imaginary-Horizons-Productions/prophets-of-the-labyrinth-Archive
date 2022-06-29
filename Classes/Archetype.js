module.exports = class Archetype {
	constructor(titleInput) {
		this.title = titleInput;
	}
	maxHp = 300;
	speed = 100;
	element = "Untyped";
	predict = "";
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

	setPredictType(predictEnum) {
		this.predict = predictEnum;
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
