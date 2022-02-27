const Help = require("../../../functions/Help.js");

module.exports = {
  exec: async function (interaction, args) {
    return {
      content: "> **Quel est la commande que tu recherche ?**",
      ephemeral: true,
      components: [
        {
          components: [
            {
              type: "SELECT_MENU",
              customId: `HELP_SEARCH_CMD&ctg=${args[0].value}`,
              placeholder: "Sélectionne ta commande.",
              options: [
                ...Help.getCategoryCommands(database.commands.array(), args[0].value).map((c) => ({
                  label: c.config.name,
                  customId: `HELP_SEARCH_CMD&ctg=${args[0].value}&cmd=${c.config.name}`,
                  value: c.config.name,
                  default: false,
                })),
              ],
            },
          ],
          type: "ACTION_ROW",
        },
      ],
    };
  },
  config: {
    name: "HELP_SEARCH",
    defer: false,
    permissions: {
      user: "NONE",
      bot: "NONE",
    },
    args: [],
    type: "BUTTON",
    description: "Deletes the message that triggered the button.",
    hidden: true,
  },
};
