const Move = require('../../Classes/Move');
const Select = require('../../Classes/Select.js');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage } = require('../adventureDAO');
const { weaponDictionary } = require('../Weapons/_weaponDictionary');
const { getFullName } = require("./../combatantDAO.js");

module.exports = new Select("weapon");

module.exports.execute = (interaction, args) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let weaponIndex = args[0];
	let weapon;
	let confirmationText = "";
	if (weaponIndex === "punch" || parseInt(weaponIndex) < user.weapons.length) {
		if (weaponIndex !== "punch") {
			weapon = user.weapons[weaponIndex];
			weapon.uses--;
			if (weapon.uses === 0) {
				user.weapons.splice(weaponIndex, 1);
				confirmationText += ` The ${weapon.name} broke!`;
			}
		} else {
			weapon = weaponDictionary["punch"];
		}

		// Add move to round list (overwrite exisiting readied move)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		let [targetTeam, targetIndex] = interaction.values[0].split("-");
		let overwritten = false;
		let newMove = new Move()
			.setSpeed(user.speed)
			.setRoundSpeed(user.roundSpeed)
			.setElement(weapon.element)
			.setIsCrit(user.crit)
			.setMoveName(weapon.name)
			.setUser(user.team, userIndex)
			.addTarget(targetTeam, targetIndex);
		for (let i = 0; i < adventure.battleMoves.length; i++) {
			let move = adventure.battleMoves[i];
			if (move.userTeam === user.team && move.userIndex === userIndex) {
				adventure.battleMoves.splice(i, 1, newMove);
				overwritten = true;
				break;
			}
		}
		if (!overwritten) {
			adventure.battleMoves.push(newMove);
		}

		// Send confirmation text
		let target;
		if (targetTeam === "ally") {
			target = adventure.delvers[targetIndex];
		} else if (targetTeam === "enemy") {
			target = adventure.battleEnemies[targetIndex];
		}
		confirmationText = `${interaction.user} readies **${weapon.name}** to use on **${getFullName(target, adventure.battleEnemyTitles)}**.` + confirmationText;
		interaction.reply({ content: confirmationText })
			.catch(console.error);
		saveAdventures();
		updateRoundMessage(interaction.channel.messages, adventure);
		checkNextRound(adventure, interaction.channel);
	} else {
		// Needed to prevent crashes in case users keep weapon menus around and use one with a broken weapon
		interaction.reply({ content: `You don't have that weapon anymore.`, ephemeral: true })
			.catch(console.error);
	}
}
