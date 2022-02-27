module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  return { content:  guild.translate("commands.note.assets.res", author.username, Math.floor(Math.random()*20)) }; 
}

module.exports.config = {
  name: "note",
  aliase: ["rate"],
  category: "fun",
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