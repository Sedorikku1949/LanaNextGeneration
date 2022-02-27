module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){}

module.exports.config = {
  name: "work",
  aliase: [],
  category: "economy",
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