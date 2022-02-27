module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!database.config.dev.evalAccess) return { content: "<:close:884084000744939571> ** ** **Cette commande est réservée aux développeurs !", ephemeral: true }
  if (!options[0]) return { content: "<:close:884084000744939571> ** ** **Il faut préciser une commande à reload !" }
  const cmd = database.commands.find(({ config }) => config.name.match(new RegExp(options[0], "g")) || (config.aliase?.length > 0 && config.aliase.includes(options[0])))
  if (!cmd) return { content: "<:close:884084000744939571> ** ** **Je n'ai pas trouvé cette commande !**" }
  return {
    content: `<:warning:897864143145685012> ** ** **Est-tu sur de vouloir recharger la commande **\`${cmd.config.name}\` **?**`,
    components: [
      {
        type: 1,
        components: [
          { disabled: false, emoji: "884084000291971084", label: "", style: 2, type: 2, custom_id: `RELOAD_CMD&cmd=${cmd.config.name}&user=${author.id}` },
        ]
      }
    ]
  }
}

module.exports.config = {
  name: "reloadcommand",
  aliase: ["rc"],
  category: "dev",
  defer: false,
  options: [],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: false,
    dev: true,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: false
  },
  lang: null,
  path: null
}