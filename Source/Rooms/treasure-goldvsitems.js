const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Treasure! Gold or Consumables?", [
	new ResourceTemplate("roomAction", "1", "internal"),
	new ResourceTemplate("gold", "250*n", "always"),
	new ResourceTemplate("consumable", "2", "always")
]).setDescription("Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Gold' and 'Consumable Bundle' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.")
	.setElement("@{adventure}");
