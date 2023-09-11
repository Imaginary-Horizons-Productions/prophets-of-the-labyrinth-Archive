const Archetype = require("../../Classes/Archetype.js");
const { generateTextBar } = require("../../helpers.js");
const { calculateTotalSpeed } = require("../combatantDAO.js");

module.exports = new Archetype("Hemomancer",
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return calculateTotalSpeed(second) - calculateTotalSpeed(first);
			});
		for (const combatant of activeCombatants) {
			const staggerCount = combatant.getModifierStacks("Stagger");
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}\nSpeed: ${calculateTotalSpeed(combatant)}` });
		}
		embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
		return [true, embed];
	},
	(combatant) => {
		const staggerCount = combatant.getModifierStacks("Stagger");
		return `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}`;
	})
	.setElement("Water")
	.setDescription("Able to predict the order combatants will act and their Stun thresholds, the Hemomancer excels at getting the last word.")
	.setSignatureEquipment(["Life Drain", "Blood Aegis"]);
