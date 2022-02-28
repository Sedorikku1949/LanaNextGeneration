const { Message, User, GuildMember } = require("discord.js")
const { generateSanctionList } = require("../../../functions/Sanction.js");

function getRole(rolesId) {
  if (rolesId.has("906539608039358464") || rolesId.has("906539604876857475")) return "administrateur/trice";
  else if (rolesId.has("906539608379101295")) return "responsable";
  else return "modérateur/trice";
}

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return `${database.emojis.close.msg} ** ** **Je ne sais pas qui recherché !**`;
  let user = await (options[0] ? (typeof options[0] !== "string" ? options[0] : guild.members.select(options[0], { bot: true }) ) : author);
  if (!user || ![User, GuildMember].some((c) => user instanceof c)) return ({ content: `${database.emojis.close.msg} ** ** **Je ne sais pas quel personne recherché !**`});
  return (await generateSanctionList(user.id, author, interaction, interaction, 0, options[1] ? options[1] : "all"));
}

module.exports.config = {
  name: "sanction",
  aliase: ["check", "sanctions", "warnings"],
  category: "moderation",
  defer: true,
  options: [
    { name: "user", description: "L'utilisateur dont vous souhaitez regarder les sanctions", type: 6, required: true },
  ],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: true,
    dev: false,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: true
  },
  lang: null,
  path: null
}