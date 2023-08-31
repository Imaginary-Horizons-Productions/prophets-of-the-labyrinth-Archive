const { CombatantReference } = require('../../Classes/Adventure');
const { Move } = require('../../Classes/Move');
const Select = require('../../Classes/Select.js');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../adventureDAO');
const { getConsumable } = require('../consumables/_consumablesDictionary');

const id = "consumable";
module.exports = new Select(id, async (interaction, [round]) => {
	// Add a move object to priority moves
	const adventure = getAdventure(interaction.channelId);
	if (adventure.room.round === Number(round)) {
		const [consumableName] = interaction.values;
		const user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		// Filter out: consumable uses by self and enemy (only count own team)
		const committedCount = adventure.room.moves.filter(move => move.name === consumableName && move.userReference.team === user.team && move.userReference.index !== userIndex).length;
		if (consumableName in adventure.consumables && adventure.consumables[consumableName] > committedCount) {
			// Add move to round list (overwrite exisiting readied move)
			const consumable = getConsumable(consumableName);
			const newMove = new Move()
				.onSetMoveSpeed(user)
				.setPriority(1)
				.setIsCrit(false)
				.setMoveName(consumableName)
				.setType("consumable")
				.setUser(new CombatantReference(user.team, userIndex));

			consumable.selectTargets(user.team, userIndex, adventure).forEach(target => {
				newMove.addTarget(target);
			})
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
			interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${consumableName}**.`).then(() => {
				setAdventure(adventure);
				if (checkNextRound(adventure)) {
					endRound(adventure, interaction.channel);
				}
			}).catch(console.error);
		} else {
			interaction.update({ content: `The party doesn't have any more ${consumableName}(s) to use.`, embeds: [], components: [] });
		}
	} else {
		interaction.update({ components: [] });
	}
});
