const { Move } = require('../../Classes/Move');
const Select = require('../../Classes/Select.js');
const { CombatantReference } = require('../../Classes/Adventure');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../adventureDAO');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary');

const id = "movetarget";
module.exports = new Select(id, async (interaction, [moveName, round, index]) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channelId);
	if (adventure.room.round === Number(round)) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (moveName === "Punch" || user.equipment.some(equip => equip.name === moveName && equip.uses > 0)) {
			// Add move to round list (overwrite exisiting readied move)
			let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
			let [targetTeam, targetIndex] = interaction.values[0].split(SAFE_DELIMITER);
			let newMove = new Move()
				.onSetMoveSpeed(user)
				.setIsCrit(user.crit)
				.setMoveName(moveName)
				.setPriority(getEquipmentProperty(moveName, "priority"))
				.setType("equip")
				.setUser(new CombatantReference(user.team, userIndex))
				.addTarget(new CombatantReference(targetTeam, targetIndex));

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
			let target;
			if (targetTeam === "delver") {
				target = adventure.delvers[targetIndex];
			} else if (targetTeam === "enemy") {
				target = adventure.room.enemies[targetIndex];
			}
			interaction.update({ components: [] });
			interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${moveName}** to use on **${target.getName(adventure.room.enemyIdMap)}**.`).then(() => {
				setAdventure(adventure);
				if (checkNextRound(adventure)) {
					endRound(adventure, interaction.channel);
				}
			}).catch(console.error);
		} else {
			// Needed to prevent crashes in case users keep ephemeral messages around and uses one with a broken equipment
			interaction.update({ content: `You don't have a ${moveName} with uses remaining.`, components: [], ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.update({ components: [] });
	}
});
