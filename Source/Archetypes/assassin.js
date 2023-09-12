const Archetype = require("../../Classes/Archetype.js");
const { getCombatantWeaknesses } = require("../combatantDAO.js");
const { getEmoji } = require("../elementHelpers.js");

module.exports = new Archetype("Assassin",
	(embed, adventure) => {
		adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers).forEach(combatant => {
			const weaknesses = getCombatantWeaknesses(combatant).map(element => getEmoji(element));
			const absorptions = ["Earth", "Fire", "Untyped", "Water", "Wind"].filter(element => `${element} Absorb` in combatant.modifiers).map(element => getEmoji(element));
			embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)} ${getEmoji(combatant.element)}`, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\nWeakness(es): ${weaknesses.join(", ")}\nResistance: ${getEmoji(combatant.element)}${absorptions.length > 0 ? `\nAbsorption(s): ${absorptions.join(", ")}` : ""}` });
		});
		return [false, embed];
	},
	(combatant) => {
		return `Weakness(es): ${getCombatantWeaknesses(combatant).map(weakness => getEmoji(weakness)).join(", ")}`;
	})
	.setElement("Wind")
	.setDescription("Able to predict which combatants will critically hit and assess combatant elemental affinities, the Assassin excels at dealing great amounts of damage.")
	.setSignatureEquipment(["Daggers", "Cloak"]);
