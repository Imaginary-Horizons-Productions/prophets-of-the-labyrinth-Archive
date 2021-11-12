const Move = require('../../Classes/Move');
const Select = require('../../Classes/Select.js');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage, endRound } = require('../adventureDAO');
const { getWeapon } = require('../Weapons/_weaponDictionary');
const { getFullName } = require("./../combatantDAO.js");

module.exports = new Select("weapon");

module.exports.execute = (interaction, [weaponIndex]) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (weaponIndex === "punch" || parseInt(weaponIndex) < user.weapons.length) {
		let weapon;
		if (weaponIndex !== "punch") {
			weapon = user.weapons[weaponIndex];
		} else {
			weapon = getWeapon("Punch");
		}

		// Add move to round list (overwrite exisiting readied move)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		let [targetTeam, targetIndex] = interaction.values[0].split("-");
		let newMove = new Move()
			.setSpeed(user)
			.setIsCrit(user.crit)
			.setMoveName(weapon.name)
			.setUser(user.team, userIndex)
			.addTarget(targetTeam, targetIndex);

		let overwritten = false;
		for (let i = 0; i < adventure.room.moves.length; i++) {
			let move = adventure.room.moves[i];
			if (move.userTeam === user.team && move.userIndex === userIndex) {
				adventure.room.moves.splice(i, 1, newMove);
				overwritten = true;
				break;
			}
		}
		if (!overwritten) {
			adventure.room.moves.push(newMove);
		}

		// Send confirmation text
		let target;
		if (targetTeam === "ally") {
			target = adventure.delvers[targetIndex];
		} else if (targetTeam === "enemy") {
			target = adventure.room.enemies[targetIndex];
		}
		interaction.reply(`${interaction.user} readies **${weapon.name}** to use on **${getFullName(target, adventure.room.enemyTitles)}**.`).then(() => {
			saveAdventures();
			updateRoundMessage(interaction.channel.messages, adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			}
		}).catch(console.error);
	} else {
		// Needed to prevent crashes in case users keep weapon menus around and uses one with a broken weapon
		interaction.reply({ content: `You don't have that weapon anymore.`, ephemeral: true })
			.catch(console.error);
	}
}
