const Help = require("../../../functions/Help.js");

module.exports = {
  exec: async function (interaction, args) {
    return Help.sendSpecificCommandHelp(database.commands.get(interaction.values[0]), interaction.guild)
  },
  config: {
    name: "HELP_SEARCH_CMD",
    defer: false,
    permissions: {
      user: "NONE",
      bot: "NONE",
    },
    args: [],
    type: "SELECT_MENU",
    description: "Deletes the message that triggered the button.",
    hidden: true,
  },
};
