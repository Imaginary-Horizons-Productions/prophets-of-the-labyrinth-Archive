module.exports = class Labyrinth {
	/** This read-only data class defines the contents and properties of a specific labyrinth
	 * @param {string} nameInput
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "Untyped"} elementInput
	 * @param {number} maxDepthInput integer
	 * @param {number[]} bossRoomDepthsInput
	 */
	constructor(nameInput, elementInput, maxDepthInput, bossRoomDepthsInput) {
		this.name = nameInput;
		this.element = elementInput;
		this.maxDepth = maxDepthInput;
		this.bossRoomDepths = bossRoomDepthsInput;
	}
	/** @type {Record<"Fire" | "Water" | "Earth" | "Wind" | "Untyped", string[]>} */
	availableConsumables = {}; //TODO #465 merge consumable changes into base labyrinth
	/** @type {Record<"Fire" | "Water" | "Earth" | "Wind" | "Untyped", Record<"Cursed" | "Common" | "Rare", string[]>>} */
	availableEquipment = {}; //TODO #464 merge equipment changes into base labyrinth
	/** @type {Record<"Event" | "Battle" | "Merchant" | "Rest Site" | "Final Battle" | "Forge" | "Artifact Guardian" | "Treasure" | "Empty" |, string[]>} */
	availableRooms = {};

	/** @param {Record<"Fire" | "Water" | "Earth" | "Wind" | "Untyped", string[]>} consumables */
	setConsumables(consumables) {
		this.availableConsumables = consumables;
		return this;
	}

	/** @param {Record<"Fire" | "Water" | "Earth" | "Wind" | "Untyped", Record<"Cursed" | "Common" | "Rare", string[]>>} equipment */
	setEquipment(equipment) {
		this.availableEquipment = equipment;
		return this;
	}

	/** @param {Record<"Event" | "Battle" | "Merchant" | "Rest Site" | "Final Battle" | "Forge" | "Artifact Guardian" | "Treasure" | "Empty" |, string[]>} rooms */
	setRooms(rooms) {
		this.availableRooms = rooms;
		return this;
	}
}
