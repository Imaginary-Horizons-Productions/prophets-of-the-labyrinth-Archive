const Archetype = require("../../Classes/Archetype.js");
const { getEmoji, getWeakness } = require("../elementHelpers.js");

module.exports = new Archetype("Assassin",
	(embed, adventure) => {
		adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers).forEach(combatant => {
			embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)} ${getEmoji(combatant.element)}`, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\nWeakness: ${getEmoji(getWeakness(combatant.element))}\nResistance: ${getEmoji(combatant.element)}` });
		});
		return [false, embed]
	},
	(combatant) => {
		return `Weakness: ${getEmoji(getWeakness(combatant.element))}`;
	})
	.setElement("Wind")
	.setDescription("Able to predict which combatants will critically hit and assess combatant elemental affinities, the Assassin excels at dealing great amounts of damage.")
	.setSignatureEquipment(["Daggers", "Cloak"]);
