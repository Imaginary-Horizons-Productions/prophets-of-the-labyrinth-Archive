// Represents metrics data and channel management data for a guild
module.exports = class GuildProfile {
    constructor(idInput, categoryIdInput, centralIdInput) {
        this.id = idInput;
        this.categoryId = categoryIdInput;
        this.centralId = centralIdInput;
        this.userIds = [];
    }
}
