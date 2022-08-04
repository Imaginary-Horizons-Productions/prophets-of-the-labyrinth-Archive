const { SAFE_DELIMITER } = require('../../constants.js');
const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("Event", "Merchant")
	.setTitle("Equipment Merchant")
	.setDescription("A masked figure sits in front of a packed rack of weapons and other equipment. \"Care to trade?\"")
	.setElement("@{adventure}");

module.exports.saleList = {
	[`equipment${SAFE_DELIMITER}?`]: "n",
	[`equipment${SAFE_DELIMITER}2`]: "1",
	"scouting": "1"
};
