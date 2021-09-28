module.exports = class Weapon {
	constructor(nameInput, descriptionInput, elementInput, effectInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.element = elementInput;
		this.effect = effectInput;
	}
	uses = 10;
	maxUses = 10;

	setUses(numberInput) {
		this.uses = numberInput;
		this.maxUses = numberInput;
		return this;
	}
}
