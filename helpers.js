const { MessageEmbed } = require("discord.js");
const fs = require("fs");

exports.versionData = {};
exports.sponsors = {};
exports.injectConfig = function (isProduction) {
	if (isProduction) {
		exports.versionData = require('./Config/versionData.json');
		exports.sponsors = require("./Config/sponsors.json");
	}
	return this;
}

exports.isSponsor = function (id) {
	let allSponsors = new Set();
	for (const group in exports.sponsors) {
		exports.sponsors[group].forEach(sponsorId => {
			if (!allSponsors.has(sponsorId)) {
				allSponsors.add(sponsorId);
			}
		})
	}
	return allSponsors.has(id);
}

exports.generateRandomNumber = function (adventure, exclusiveMax, branch) {
	if (exclusiveMax === 1) {
		return 0;
	} else {
		branch = branch.toLowerCase();
		let digits = Math.ceil(Math.log2(exclusiveMax) / Math.log2(12));
		let start = adventure.rnIndices[branch];
		let end = start + digits;
		adventure.rnIndices[branch] = end % adventure.rnTable.length;
		let max = 12 ** digits;
		let sectionLength = max / exclusiveMax;
		let roll = parseInt(adventure.rnTable.slice(start, end), 12);
		return Math.floor(roll / sectionLength);
	}
}

exports.parseCount = function (countExpression, nValue) {
	return Math.ceil(countExpression.split("*").reduce((total, term) => {
		if (term === "n") {
			return total * nValue;
		} else {
			return total * Number(term);
		}
	}, 1));
}

exports.clearComponents = function (messageId, messageManager) {
	if (messageId) {
		messageManager.fetch(messageId).then(message => {
			message.edit({ components: [] });
		})
	}
}

/**
 * Generate parent directories if necessary, and save a file.
 * Keeps a backup of the fileName that may be replaced, until writing succeeds
 *
 * @param {string} dirPath path to the directory of a file
 * @param {string} fileName name of the file to be saved
 * @param {string} data string to be written to the file
 */
exports.ensuredPathSave = async function (dirPath, fileName, data) {
	const filePath = dirPath + "/" + fileName;
	const backupFilePath = filePath + ".bak";
	fs.promises.mkdir(dirPath, { recursive: true }) // (idempotently) establish prerequisite directory, in advance
		.then(() => fs.promises.rename(filePath, backupFilePath)) // save previous file as backup
		.catch((err) => err.code === 'ENOENT' ? undefined : Promise.reject(err)) // ignore ENOENT (file not found) for rename if save didn't already exist
		.then(() => fs.promises.writeFile(filePath, data, { encoding: "utf8" })
		.catch((err) => Promise.reject(new Error("writeFile failed", { cause: err })))) // promote errors (including ENOENT) for writeFile)
		.then(() => fs.promises.rm(backupFilePath)) // remove backup only if previous steps did not fatally fail
		.catch((err) => err.code === 'ENOENT' ? undefined : Promise.reject(err)) // ignore ENOENT (file not found) for rm if save didn't already exist to be backed-up
		.catch(console.error) // log error, and avoid fatally crashing
}

exports.ordinalSuffixEN = function (integer) {
	let lastDigit = integer % 10;
	let tensDigit = integer % 100 / 10;
	switch (lastDigit) {
		case 1:
			if (tensDigit !== 1) {
				return `${integer}st`;
			}
		case 2:
			if (tensDigit !== 1) {
				return `${integer}nd`;
			}
		case 3:
			if (tensDigit !== 1) {
				return `${integer}rd`;
			}
		default:
			return `${integer}th`;
	}
}

exports.getVersionEmbed = function (avatarURL) {
	return fs.promises.readFile('./ChangeLog.md', { encoding: 'utf8' }).then(data => {
		const dividerRegEx = /####/g;
		const changesStartRegEx = /\.\d+:/g;
		const knownIssuesStartRegEx = /### Known Issues/g;
		let titleStart = dividerRegEx.exec(data).index;
		changesStartRegEx.exec(data);
		let knownIssuesStart;
		let knownIssueStartResult = knownIssuesStartRegEx.exec(data);
		if (knownIssueStartResult) {
			knownIssuesStart = knownIssueStartResult.index;
		}
		let knownIssuesEnd = dividerRegEx.exec(data).index;

		let embed = new MessageEmbed().setColor('6b81eb')
			.setAuthor({ name: "Click here to check out the Imaginary Horizons GitHub", iconURL: avatarURL, url: "https://github.com/Imaginary-Horizons-Productions" })
			.setTitle(data.slice(titleStart + 5, changesStartRegEx.lastIndex))
			.setURL('https://discord.gg/JxqE9EpKt9')
			.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/734099622846398565/newspaper.png')
			.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
			.setTimestamp();

		if (knownIssuesStart && knownIssuesStart < knownIssuesEnd) {
			// Known Issues section found
			embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesStart))
				.addField(`Known Issues`, data.slice(knownIssuesStart + 16, knownIssuesEnd))
		} else {
			// Known Issues section not found
			embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd));
		}

		return embed.addField(`Become a Sponsor`, `Chip in for server costs or get premimum features by sponsoring [PotL on GitHub](https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth)`);
	})
}

exports.SAFE_DELIMITER = "→";
