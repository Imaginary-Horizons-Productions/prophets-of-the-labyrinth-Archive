const { CombatantReference } = require('../../Classes/Adventure.js');
const Button = require('../../Classes/Button.js');
const { Move } = require('../../Classes/Move');
const { SAFE_DELIMITER } = require("../../constants.js");
const { generateRandomNumber } = require('../../helpers.js');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../adventureDAO');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

const customId = "confirmmove";
module.exports = new Button(customId,
	/** Add move object to adventure */
	async (interaction, [moveName, round, index]) => {
		const adventure = getAdventure(interaction.channel.id);
		if (adventure.room.round === Number(round)) {
			const user = adventure.delvers.find(delver => delver.id === interaction.user.id);
			if (user.equipment.some(equip => equip.name === moveName && equip.uses > 0)) {
				// Add move to round list (overwrite exisiting readied move)
				const userIndex = user.findMyIndex(adventure);
				let newMove = new Move()
					.onSetMoveSpeed(user)
					.setIsCrit(user.crit)
					.setMoveName(moveName)
					.setPriority(getEquipmentProperty(moveName, "priority"))
					.setType("equip")
					.setUser(new CombatantReference(user.team, userIndex));

				let targetText = "";
				let { target, team } = getEquipmentProperty(moveName, "targetingTags");
				if (target === "all") {
					let targetCount = 0;
					if (team === "delver") {
						targetCount = adventure.delvers.length;
						targetText = "all allies";
					} else if (team === "enemy") {
						targetCount = adventure.room.enemies.length;
						targetText = "all enemies";
					}
					for (let i = 0; i < targetCount; i++) {
						newMove.addTarget(new CombatantReference(team, i));
					}
				} else if (target.startsWith("random")) {
					let targetCount = Number(target.split(SAFE_DELIMITER)[1]);
					let poolSize = 0;
					if (team === "delver") {
						poolSize = adventure.delvers.length;
						targetText = `${targetCount} random all${targetCount === 1 ? "y" : "ies"}`;
					} else if (team === "enemy") {
						poolSize = adventure.room.enemies.length;
						targetText = `${targetCount} random enem${targetCount === 1 ? "y" : "ies"}`;
					}
					for (let i = 0; i < targetCount; i++) {
						newMove.addTarget(new CombatantReference(team, generateRandomNumber(adventure, poolSize, "battle")));
					}
				} else if (target === "self") {
					newMove.addTarget(new CombatantReference(team, userIndex));
				} else if (target === "none") {
					newMove.addTarget(new CombatantReference("none", -1));
				}

				let overwritten = false;
				for (let i = 0; i < adventure.room.moves.length; i++) {
					const { userReference } = adventure.room.moves[i];
					if (userReference.team === user.team && userReference.index === userIndex) {
						await adventure.room.moves.splice(i, 1);
						overwritten = true;
						break;
					}
				}
				await adventure.room.moves.push(newMove);

				// Send confirmation text
				interaction.update({ components: [] });
				interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${moveName}**${target !== "none" && target !== "self" ? ` to use on **${targetText}**` : ""}.`).then(() => {
					setAdventure(adventure);
					if (checkNextRound(adventure)) {
						endRound(adventure, interaction.channel);
					};
				}).catch(console.error);
			} else {
				interaction.reply({ content: `You don't have a ${moveName} with uses remaining.`, ephemeral: true })
					.catch(console.error);
			}
		} else {
			interaction.update({ components: [] });
		}
	}
);
