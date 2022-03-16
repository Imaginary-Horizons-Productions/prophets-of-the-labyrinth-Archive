Welcome prospective developers! We're so glad you've interested in helping out.

## Local Setup Instructions
1. Clone the repo
2. Setup your discord bot
3. Copy `/Templates/Dev Setup` into root and rename it to `/Config`
4. Populate `/Config/auth.json` and `/Config/versionData.json`
5. Make sure you're in root and run the following:
   1. Run `npm install`
   2. Run `node .\upload_commands.js`
   3. Run `node .\bot.js`

## Style
- This project uses tabs for indentation to reduce file size and keypresses during code navigation
- Bot feedback messages should be written in 3rd-person passive tense and make requests in polite language
    - Example: "Your bounty could not be posted. Please remove phrases disallowed by the server from the title and try again."
