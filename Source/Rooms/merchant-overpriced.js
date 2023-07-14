const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Overpriced Merchant", [
	new ResourceTemplate("equipment", "2*n", "always", "?", "1.5*n", `equipment${SAFE_DELIMITER}?`),
	new ResourceTemplate("equipment", "2", "always", "Rare", "1.5*n", `equipment${SAFE_DELIMITER}Rare`),
	new ResourceTemplate("scouting", "1", "always", "Common", "n", "scouting")
]).setDescription("A masked figure sits in front of a packed rack of weapons and other equipment. \"Best selction around! Looking for something particular?\"")
	.setElement("@{adventure}");
