const Move = require('../../Classes/Move');
const Select = require('../../Classes/Select.js');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage } = require('../adventureDAO');

module.exports = new Select("weapon");

module.exports.execute = (interaction, args) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (user.weapons.length > args[0]) {
		let weapon = user.weapons[args[0]];
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		let targetTeam = args[1];
		let targetIndex = args[2];
		adventure.battleMoves.push(new Move()
			.setSpeed(user.speed)
			.setRoundSpeed(user.roundSpeed)
			.setElement(weapon.element)
			.setIsCrit(user.crit)
			.setMoveName(weapon.name)
			.setUser(user.team, userIndex)
			.setTarget(targetTeam, targetIndex)
			.setEffect(weapon.effect));
		saveAdventures();
		interaction.reply({ content: `Your plan to use **${weapon.name}** on **${adventure.battleEnemies[targetIndex].name}** next round has been recorded.`, ephemeral: true })
			.catch(console.error);
		updateRoundMessage(interaction.message, adventure);
		checkNextRound(adventure, interaction.channel);
	} else {
		interaction.reply({ content: `You don't have a weapon in slot ${Number(args[0]) + 1}.`, ephemeral: true })
			.catch(console.error);
	}
}
