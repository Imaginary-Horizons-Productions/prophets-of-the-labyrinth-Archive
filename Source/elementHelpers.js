const ELEMENTS = {
	"Fire": {
		color: "ca314a",
		emoji: "🔥",
		opposite: "Water",
		weakness: "Earth"
	},
	"Earth": {
		color: "809e84",
		emoji: "🌿",
		opposite: "Wind",
		weakness: "Water"
	},
	"Water": {
		color: "29a9be",
		emoji: "💦",
		opposite: "Fire",
		weakness: "Wind"
	},
	"Wind": {
		color: "7d54c6",
		emoji: "💨",
		opposite: "Earth",
		weakness: "Fire"
	},
	"Untyped": {
		color: "445458",
		emoji: "🌐",
		opposite: "Untyped",
		weakness: "none"
	}
}

/** Get a list of all possible elements
 * @param {boolean} includeUntyped
 * @returns {("Fire" | "Earth" | "Water" | "Wind" | "Untyped")[]}
 */
exports.elementsList = function (includeUntyped = false) {
	if (includeUntyped) {
		return Object.keys(ELEMENTS);
	} else {
		return Object.keys(ELEMENTS).filter(element => element !== "Untyped");
	}
}

/** Get the element that deals increased damage to the given element
 * @param {"Fire" | "Earth" | "Water" | "Wind" | "Untyped"} element
 * @returns {"Fire" | "Earth" | "Water" | "Wind" | "Untyped"}
 */
exports.getWeakness = function (element) {
	if (element in ELEMENTS) {
		return ELEMENTS[element].weakness;
	} else {
		return "none";
	}
}

/** Each element has an assigned Discord parseable color
 * @param {"Fire" | "Earth" | "Water" | "Wind" | "Untyped"} element
 */
exports.getColor = function (element) {
	return ELEMENTS[element]?.color || ELEMENTS["Untyped"].color;
}

/** Each element has an associated emoji
 * @param {"Fire" | "Earth" | "Water" | "Wind" | "Untyped"} element
 */
exports.getEmoji = function (element) {
	return ELEMENTS[element]?.emoji || "n/a";
}

/** Used in "opposite of adventure" element
 * @param {"Fire" | "Earth" | "Water" | "Wind" | "Untyped"} element
 * @returns {"Fire" | "Earth" | "Water" | "Wind" | "Untyped"}
 */
exports.getOpposite = function (element) {
	return ELEMENTS[element]?.opposite || "n/a";
}
