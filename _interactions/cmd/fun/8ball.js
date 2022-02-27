const Discord = require("discord.js");

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return guild.translate("commands.8ball.assets.noArgs");
  const answer = (guild.translate("commands.8ball.assets.properties")[Math.floor(Math.random()*(guild.translate("commands.8ball.assets.properties")?.length || 5))] || "ERROR")
  return guild.translate("commands.8ball.assets.res", (interaction instanceof Discord.CommandInteraction ? "`"+options.join(" ").slice(0,1800)+"`\n\n" : "") ,author.username, answer);
}

module.exports.config = {
  name: "8ball",
  aliase: [],
  category: "fun",
  defer: false,
  options: [
    { name: "question", required: true, description: "La question à poser à la 8ball", type: 3 }
  ],
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