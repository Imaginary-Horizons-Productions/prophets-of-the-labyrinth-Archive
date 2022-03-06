module.exports = class Artifact {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
	}
	element = "";
	flavorText = [];
	//TODO #217 artifact performance stats on artifact, show as field in artifact details embed

	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	setFlavorText(fieldArray) {
		this.flavorText = fieldArray;
		return this;
	}
}
