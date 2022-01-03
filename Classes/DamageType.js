module.exports = class DamageType { // Synonymous with element, using "DamageType" as alias due to "Element" being a built-in js class
	constructor() { }


	static elementsList() {
		return Object.keys(ELEMENTS);
	}

	static getColor(element) {
		return ELEMENTS[element].color;
	}

	static getEmoji(element) {
		return ELEMENTS[element].emoji;
	}

	static getOpposite(element) {
		return ELEMENTS[element].opposite;
	}

	static getWeaknesses(element) {
		if (DamageType.elementsList().includes(element)) {
			return ELEMENTS[element].weaknesses;
		} else {
			return ["none"];
		}
	}

	static getResistances(element) {
		if (DamageType.elementsList().includes(element)) {
			return ELEMENTS[element].resistances;
		} else {
			return ["none"];
		}
	}
}

const ELEMENTS = {
	"Fire": {
		color: "RED",
		emoji: "🔥",
		opposite: "Water",
		weaknesses: ["Earth", "Darkness"],
		resistances: ["Light", "Wind"]
	},
	"Earth": {
		color: "ORANGE",
		emoji: "🌿",
		opposite: "Wind",
		weaknesses: ["Water", "Darkness"],
		resistances: ["Fire", "Light"]
	},
	"Light": {
		color: "YELLOW",
		emoji: "✨",
		opposite: "Darkness",
		weaknesses: ["Fire", "Earth"],
		resistances: ["Wind", "Water"]
	},
	"Water": {
		color: "BLUE",
		emoji: "💦",
		opposite: "Fire",
		weaknesses: ["Wind", "Light"],
		resistances: ["Darkness", "Earth"]
	},
	"Wind": {
		color: "GREEN",
		emoji: "💨",
		opposite: "Earth",
		weaknesses: ["Light", "Fire"],
		resistances: ["Water", "Darkness"]
	},
	"Darkness": {
		color: "PURPLE",
		emoji: "♟️",
		opposite: "Light",
		weaknesses: ["Wind", "Water"],
		resistances: ["Earth", "Fire"]
	}
}
