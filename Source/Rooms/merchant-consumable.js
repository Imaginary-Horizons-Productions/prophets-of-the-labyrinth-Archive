const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Consumable Merchant", [
	new ResourceTemplate("equipment", "n", "always", "?", "n", `equipment${SAFE_DELIMITER}?`),
	new ResourceTemplate("consumable", "n", "always", "Common", "n", "consumables"),
	new ResourceTemplate("scouting", "1", "always", "Common", "n", "scouting")
]).setDescription("A masked figure sits in front of a a line up of flasks and vials. \"Care to trade?\"")
	.setElement("@{adventure}");
