const Move = require('../../Classes/Move');
const Select = require('../../Classes/Select.js');
const Weapon = require('../../Classes/Weapon.js');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage } = require('../adventureDAO');
const { weaponDictionary } = require('../Weapons/_weaponDictionary');
const { getFullName } = require("./../combatantDAO.js");

module.exports = new Select("weapon");

module.exports.execute = (interaction, args) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let weaponIndex = args[0];
	let weapon = user.weapons[weaponIndex];
	if (weapon.name !== "empty" || user.weapons.every(weapon => weapon.name === "empty")) {
		let confirmationText = "";
		if (weapon.name === "empty") {
			weapon = weaponDictionary["punch"];
		} else {
			weapon.uses--;
			if (weapon.uses === 0) {
				user.weapons.splice(weaponIndex, 1, Object.assign(new Weapon(), weaponDictionary["empty"]));
				confirmationText += ` Your ${weapon.name} broke!`;
			}
		}
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		let targetTeam = args[1];
		let targetIndex = args[2];
		console.log(weapon);
		adventure.battleMoves.push(new Move()
			.setSpeed(user.speed)
			.setRoundSpeed(user.roundSpeed)
			.setElement(weapon.element)
			.setIsCrit(user.crit)
			.setMoveName(weapon.name)
			.setUser(user.team, userIndex)
			.setTarget(targetTeam, targetIndex)
			.setEffect(weapon.effect));
		let target;
		if (targetTeam === "ally") {
			target = adventure.delvers[targetIndex];
		} else if (targetTeam === "enemy") {
			target = adventure.battleEnemies[targetIndex];
		}
		confirmationText = `Your plan to use **${weapon.name}** on **${getFullName(target, adventure.battleEnemyTitles)}** next round has been recorded.` + confirmationText;
		interaction.reply({ content: confirmationText, ephemeral: true })
			.catch(console.error);
		saveAdventures();
		updateRoundMessage(interaction.message, adventure);
		checkNextRound(adventure, interaction.channel);
	} else {
		interaction.reply({ content: `You don't have a weapon in slot ${Number(weaponIndex) + 1}.`, ephemeral: true })
			.catch(console.error);
	}
}
