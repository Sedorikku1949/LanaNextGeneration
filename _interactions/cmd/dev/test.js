module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  return "hello world";
}

module.exports.config = {
  name: "test",
  aliase: [],
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