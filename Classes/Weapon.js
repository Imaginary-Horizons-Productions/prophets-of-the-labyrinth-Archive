module.exports = class Weapon {
	constructor(nameInput, descriptionInput, elementInput, effectInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.element = elementInput;
		this.effect = effectInput;
		this.power = 10;
		this.uses = 10;
		this.maxUses = 10;
	}

	setPower(numberInput) {
		this.power = numberInput;
		return this;
	}

	setUses(numberInput) {
		this.uses = numberInput;
		this.maxUses = numberInput;
		return this;
	}
}
