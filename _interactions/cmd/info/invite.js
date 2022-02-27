module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){ return guild.translate("commands.invite.assets"); }

module.exports.config = {
  name: "invite",
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