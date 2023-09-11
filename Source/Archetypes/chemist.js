const Archetype = require("../../Classes/Archetype.js");
const { generateTextBar } = require("../../helpers.js");
const { modifiersToString } = require("../combatantDAO.js");

module.exports = new Archetype("Chemist",
	(embed, adventure) => {
		adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
			const modifiersText = modifiersToString(combatant, false, adventure);
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `${generateTextBar(combatant.hp, combatant.maxHp, 16)} ${combatant.hp}/${combatant.maxHp} HP${combatant.block ? `, ${combatant.block} Block` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		})
		return [false, embed];
	},
	(combatant) => {
		return `HP: ${combatant.hp}/${combatant.maxHp}`;
	})
	.setElement("Water")
	.setDescription("Able to and assess combatant modifiers and hp levels, the Chemist excels at managing party and enemy health.")
	.setSignatureEquipment(["Sickle", "Potion Kit"]);
