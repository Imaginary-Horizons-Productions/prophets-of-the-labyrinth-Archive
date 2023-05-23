const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Equipment Merchant", [
	new ResourceTemplate("equipment", "n", "always", "?", "n", `equipment${SAFE_DELIMITER}?`),
	new ResourceTemplate("equipment", "1", "always", "Rare", "n", `equipment${SAFE_DELIMITER}Rare`),
	new ResourceTemplate("scouting", "1", "always", "Common", "n", "scouting")
]).setDescription("A masked figure sits in front of a packed rack of weapons and other equipment. \"Care to trade?\"")
	.setElement("@{adventure}");
