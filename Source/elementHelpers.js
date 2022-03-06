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
	},
	"Untyped": {
		color: "",
		emoji: "",
		opposite: "",
		weaknesses: [],
		resistances: []
	}
}
exports.getResistances = function (element) {
	if (exports.elementsList().includes(element)) {
		return ELEMENTS[element].resistances;
	} else {
		return ["none"];
	}
}

exports.getWeaknesses = function (element) {
	if (exports.elementsList().includes(element)) {
		return ELEMENTS[element].weaknesses;
	} else {
		return ["none"];
	}
}

exports.elementsList = function (includeUntyped = false) {
	if (includeUntyped) {
		return Object.keys(ELEMENTS);
	} else {
		return Object.keys(ELEMENTS).filter(element => element !== "Untyped");
	}
}

exports.getColor = function (element) {
	return ELEMENTS[element].color;
}

exports.getEmoji = function (element) {
	return ELEMENTS[element].emoji;
}

exports.getOpposite = function (element) {
	return ELEMENTS[element].opposite;
}
