const dayjs = require("dayjs")

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  return guild.translate(
    "commands.bot.assets.default", 
    client.user.displayAvatarURL(),
    await client.api.oauth2.applications['@me'].get().then(e => e.description),
    client.guilds.cache.size, client.guilds.cache.reduce((a, b) => a + b.memberCount, 0), client.channels.cache.size,
    process.version, '8.1.0', require("discord.js").version,
    dayjs(client.readyTimestamp).format("DD/MM/YYYY à HH:mm"), Math.trunc(client.readyTimestamp/1000), database.inviteURL,
  )
}

module.exports.config = {
  name: "bot",
  aliase: ["kady"],
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