const { readFileSync } = require('fs')

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  return ({
    content: "Par "+author.tag+" :\n<@&906539625571561523>",
    files: [{ attachment: readFileSync("_interactions/cmd/moderation/incoming.jpg"), name: "incoming.jpg" }],
    allowedMentions: { roles: ["906539625571561523"] }
  });
}

module.exports.config = {
  name: "staff",
  aliase: [],
  category: "moderation",
  defer: false,
  options: [],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: true,
    dev: false,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: false
  },
  lang: null,
  path: null
}