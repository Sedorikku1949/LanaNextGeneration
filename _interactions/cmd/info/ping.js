const tr = (nb) => (nb < 150) ? 1 : (nb < 300) ? 2 : (nb < 450) ? 3 : 4

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  return guild.translate("commands.ping.assets", client.ws.ping, guild.translate(`commands.ping.misc[${tr(client.ws.ping)}]`));
}

module.exports.config = {
  name: "ping",
  aliase: [],
  category: "info",
  defer: false,
  options: [],
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