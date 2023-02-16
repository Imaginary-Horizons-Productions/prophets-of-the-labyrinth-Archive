module.exports = class Resource {
	/** This read-write payload class describes a single resource available in an adventure's room
	 * @param {string} nameInput Note: all names in the combined pool of equipment, artifacts, consumables, and resources must be unique
	 * @param {"equipment" | "artifact" | "gold" | "scouting" | "roomAction" | "challenge"| "consumable"} resourceTypeInput
	 * @param {number} countInput
	 * @param {"loot" | "always" | "internal"} visibilityInput "loot" only shows in end of room loot, "always" always shows in ui, "internal" never shows in ui
	 * @param {number} costInput
	 * @param {string} selectName - Only necessary for UI with multiple generated selects (eg merchants)
	 */
	constructor(nameInput, resourceTypeInput, countInput, visibilityInput, costInput, selectName) {
		this.name = nameInput;
		this.resourceType = resourceTypeInput;
		this.visibility = visibilityInput;
		this.count = countInput;
		this.cost = costInput;
		this.uiGroup = selectName;
	}
}
