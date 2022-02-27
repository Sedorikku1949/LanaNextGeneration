module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!database.config.dev.evalAccess) return { content: "<:close:884084000744939571> ** ** **Cette commande est réservée aux développeurs !", ephemeral: true }
  const msg = await channel.send("> <:reload:885157955790589982> ** ** **Rechargement...**");
  global["reload"] = { channel: channel.id, msg: msg.id };
  global["database"]?.Client.reloadAll();
}

module.exports.config = {
  name: "reload",
  aliase: ["restart"],
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