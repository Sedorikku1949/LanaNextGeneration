const Help = require("../../../functions/Help.js")

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  const cmd = database.commands.array().find(cmd => cmd.config.name == options[0] || cmd.config.aliase?.includes(options[0]))
  const allCtg = Help.getAllCategory(database.commands.array());
  const actualCtg = allCtg[0];
  if (options[0]) return (cmd ? Help.sendSpecificCommandHelp(cmd, guild) : { content: "> **Aucune commande n'a été trouvée**", ephemeral: true });
  return ({
    embeds: [{
      color: database.Language.find(guild.getLanguage(), "color.primary"),
      footer: { name: guild.translate("misc.help.footerName", 1, allCtg.length+1), icon_url: client.user.displayAvatarURL({ size: 512, format: "png" }) },
      title: Help.generateCategoryStringList(allCtg.map((c) => (guild.translate(`misc.category["${c}"]`) || c)), guild.translate(`misc.category["${actualCtg}"]`) || actualCtg),
      description: Help.generateCommandStringList(Help.getCategoryCommands(database.commands.array(), actualCtg), actualCtg, guild.translate("misc.help.noCommands.default")),
    }], 
    components: [
      { components: [ { type: 'SELECT_MENU', customId: `HELP_CTG_MENU&ctg=${actualCtg}`, placeholder: 'Quel catégorie souhaite-tu voir ?', options: [...allCtg.map((c) => ({ label: (guild.translate(`misc.category["${c}"]`) || c), customId: `HELP_CTG_SELECT&ctg=${c}`, value: c, default: false }) )] } ], type: 'ACTION_ROW' },
      {
        // BUTTONS 
        components: [
          { disabled: false, emoji: "885157955241115698", label: "", style: 2, type: 2, custom_id: `HELP_UNDO&ctg=${actualCtg}&user=${author.id}` },
          { disabled: false, emoji: "885157955459235870", label: "", style: 2, type: 2, custom_id: `HELP_REDO&ctg=${actualCtg}&user=${author.id}` },
          { disabled: false, emoji: "885157955182428220", label: "", style: 2, type: 2, custom_id: `HELP_SEARCH&ctg=${actualCtg}&user=${author.id}`, disabled: actualCtg == "sommaire" ? true : false },
          { disabled: false, emoji: "885157955270488084", label: "", style: 2, type: 2, custom_id: `MSG_DELETE&ctg=${actualCtg}&user=${author.id}` },
        ],
        type: 1
      }
    ]
  })
}

module.exports.config = {
  name: "help",
  aliase: ["h"],
  category: "info",
  defer: false,
  options: [
    { name: "command", description: "Si tu as une commande à chercher.", required: false, type: 3 }
  ],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: false,
    dev: false,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: true
  },
  lang: null,
  path: null
}