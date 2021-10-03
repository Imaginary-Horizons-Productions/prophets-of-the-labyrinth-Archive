const Button = require('../../Classes/Button.js');
const Move = require('../../Classes/Move');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage } = require('../adventureDAO');
const { weaponDictionary } = require('../Weapons/_weaponDictionary');
const { getFullName } = require("./../combatantDAO.js");

module.exports = new Button("nontargetweapon");

module.exports.execute = (interaction, args) => { //TODO #33 implement non-targeting moves
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let weaponIndex = args[0];
	let confirmationText = "";
	if (weaponIndex !== "punch") {
		let weapon = user.weapons[weaponIndex];
		weapon.uses--;
		if (weapon.uses === 0) {
			user.weapons.splice(weaponIndex, 1);
			confirmationText += ` Your ${weapon.name} broke!`;
		}
	} else {
		weapon = weaponDictionary["punch"];
	}
	let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
	let targetTeam = args[1];
	let targetIndex = args[2];
	adventure.battleMoves.push(new Move() //TODO #34 extra moves from same user should overwrite previous selection
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
	updateRoundMessage(interaction.channel.messages, adventure);
	checkNextRound(adventure, interaction.channel);
}
