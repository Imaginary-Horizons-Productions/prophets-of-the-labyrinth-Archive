const helpers = require("../../helpers.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("Event", "Merchant")
	.setTitle("Weapon Merchant")
	.setDescription("A masked figure sits in front of a packed rack of weapons. \"Care to trade?\"")
	.setElement("@{adventure}");

module.exports.saleList = {
	[`weapon${helpers.SAFE_DELIMITER}?`]: "n",
	[`weapon${helpers.SAFE_DELIMITER}2`]: "1",
	"scouting": "1"
};
