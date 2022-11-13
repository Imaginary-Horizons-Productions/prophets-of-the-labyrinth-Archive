module.exports = class ResourceTemplate {
	/** This read-only data class that defines resources available for placement in rooms
	 * @param {"equipment" | "artifact" | "gold" | "scouting" | "roomAction" | "challenge" | "consumable"} resourceTypeInput
	 * @param {string} countExpression
	 * @param {"loot" | "always" | "internal"} visibilityInput "loot" only shows in end of room loot, "always" always shows in ui, "internal" never shows in ui
	 * @param {"Cursed" | "Common" | "Rare" | "?"} tierInput
	 * @param {string} costExpression
	 * @param {string} selectName
	 */
	constructor(resourceTypeInput, countExpression, visibilityInput, tierInput, costExpression = "0", selectName) {
		this.resourceType = resourceTypeInput;
		this.count = countExpression;
		this.visibility = visibilityInput;
		this.tier = tierInput;
		this.cost = costExpression;
		this.uiGroup = selectName;
	}
}
