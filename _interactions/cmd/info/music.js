module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){ return guild.translate("commands.music.assets") }

module.exports.config = {
  name: "music",
  aliase: ["musique", "skip", "play", "seek", "nowplaying", "np"],
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
    isSlashCommand: false
  },
  lang: null,
  path: null
}