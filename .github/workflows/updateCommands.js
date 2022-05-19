const fs = require('fs');
const { commandSets } = require('../../Source/Commands/_commandDictionary.js');

let text = "";

commandSets.forEach(commandSet => {
	text += `## ${commandSet.name}\n${commandSet.description}\n`;
	commandSet.fileNames.forEach(filename => {
		const command = require(`./../../Source/Commands/${filename}`);
		text += `### /${command.name}\n${command.description}\n`;
		for (const optionData of command.data.options) {
			text += `#### ${optionData.name}${optionData.required ? "" : " (optional)"}\n${optionData.description}\n`;
		}
	})
})

fs.writeFile('Wiki/Commands.md', text, (error) => {
	if (error) {
		console.error(error);
	}
});
