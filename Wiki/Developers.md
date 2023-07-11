Welcome prospective developers! We're so glad you've interested in helping out.

## Local Setup Instructions
1. Clone the repo
2. Setup your discord bot
3. Copy `/Blueprints/Config` into root
4. Populate `/Config/auth.json` and `/Config/versionData.json`
5. Make sure you're in root and run the following:
   1. Run `npm install`
   2. Run `npm start`

## Procedure
- Stories start as Discussions, where they are developed until they achieve Story Completion
- Restricting creating Issues until Story Completion (aka Story Approval) is intended to allow developers to confidently asynchronously select work on any Issue knowing that
   - The Issue is not a duplicate
   - The Issue's requirements are defined enough to complete the Story
   - The Issue is unlikely to be in conflict with other work
- When a Discussion achieves Story Completion, it is promoted to an Issue and the corresponding Discussion is deleted
- Issues may futher be grouped into Milestones, which represent the minimum Issues required to release the next version
- Issues not grouped into a Milestone can be added to any Milestone upon completion
- Each Issue should have its own Feature Branch
- When work on an Issue is complete, a Pull Request is opened to the relevant release branch (`main` is live)
- Pull Requests are to require `log10(active developers)` reviews
- Feature Branches are to be deleted after their Pull Requests are merged or rejected

## Style
1. This project uses tabs for indentation to reduce file size and keypresses during code navigation
1. Bot feedback messages should be written in 3rd-person passive tense and make requests in polite language
    - Example: "Your bounty could not be posted. Please remove phrases disallowed by the server from the title and try again."

### Move Result Messages
1. All messages should mention Modifiers applied, but avoid specifying quantity
1. Boss messages can contain flavor/world building text, non-boss enemies and gear should avoid doing so because they more frequently repeated
1. Modifier names can be conjugated, but should be capitalized
