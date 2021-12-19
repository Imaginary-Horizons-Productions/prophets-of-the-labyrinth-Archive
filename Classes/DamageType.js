module.exports = class DamageType { // Synonymous with element, renamed to damage type due to "Element" being a built-in js class
	constructor() { }

	static elementsList() {
		return ["Fire", "Earth", "Light", "Water", "Wind", "Darkness"];
	}

	static getColor(element) {
		switch (element) {
			case "Light":
				return "YELLOW";
			case "Darkness":
				return "PURPLE";
			case "Fire":
				return "RED";
			case "Water":
				return "BLUE";
			case "Earth":
				return "ORANGE";
			case "Wind":
				return "GREEN";
			default:
				return "GREY";
		}
	}

	static getOpposite(element) {
		switch (element) {
			case "Light":
				return "Darkness";
			case "Darkness":
				return "Light";
			case "Fire":
				return "Water";
			case "Water":
				return "Fire";
			case "Earth":
				return "Wind";
			case "Wind":
				return "Earth";
			default:
				return "none";
		}
	}

	static getWeaknesses(element) {
		switch (element) {
			case "Light":
				return ["Fire", "Earth"];
			case "Darkness":
				return ["Wind", "Water"];
			case "Fire":
				return ["Earth", "Darkness"];
			case "Water":
				return ["Wind", "Light"];
			case "Earth":
				return ["Water", "Darkness"];
			case "Wind":
				return ["Light", "Fire"];
			default:
				return ["none"];
		}
	}

	static getResistances(element) {
		switch (element) {
			case "Light":
				return ["Wind", "Water"];
			case "Darkness":
				return ["Earth", "Fire"];
			case "Fire":
				return ["Light", "Wind"];
			case "Water":
				return ["Darkness", "Earth"];
			case "Earth":
				return ["Fire", "Light"];
			case "Wind":
				return ["Water", "Darkness"];
			default:
				return ["none"];
		}
	}
}
