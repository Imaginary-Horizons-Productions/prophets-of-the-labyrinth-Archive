module.exports = class Character {
	constructor(titleInput) {
		this.title = titleInput;
	}
	maxHp = 300;
	speed = 100;
	element = "untyped";
	read = "";
	signatureWeapons = [];

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

	setReadType(readLabel) {
		this.read = readLabel;
		return this;
	}

	setSignatureWeapons(weaponArray) {
		this.signatureWeapons = weaponArray;
		return this;
	}
}
