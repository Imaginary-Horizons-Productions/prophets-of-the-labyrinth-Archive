// Represents metrics data and channel management data for a guild
module.exports = class GuildProfile {
    constructor(idInput) {
        this.id = idInput;
    }
	userIds = [];
	adventuring = new Set();
}
