// Read and write object for adventure.room.resources
module.exports = class Resource {
	constructor(nameInput, resourceTypeInput, countInput, uiTypeInput) {
		this.name = nameInput; // Note: all names in the combined pool of weapons, artifacts, and resources must be unique
		this.resourceType = resourceTypeInput; // enum: "weapon", "artifact", "gold", "scouting", "forgeSupplies"
		this.count = countInput;
		this.uiType = uiTypeInput; // enum: "loot", "merchant", "resource"
	}

	setUIGroup(selectName) {
		// token for which select to categorize under (if applicable)
		this.uiGroup = selectName;
		return this;
	}
}
