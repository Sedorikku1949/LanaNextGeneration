const { Message } = require("discord.js")
const { sendLogs, generateId } = require("../../../functions/Sanction.js");

function getRole(rolesId) {
  if (rolesId.has("906539608039358464") || rolesId.has("906539604876857475")) return "administrateur";
  else if (rolesId.has("906539608379101295")) return "responsable";
  else return "modérateur";
}

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return `${database.emojis.close.msg} ** ** **Je ne sais pas qui avertir !**`;
  let user = await (options[0] ? (typeof options[0] !== "string" ? options[0] : guild.members.select(options[0], { bot: true }) ) : author);
  if (!user || !guild.members.cache.get(user?.id)) return ({ content: `${database.emojis.close.msg} ** ** **Je ne sais pas quel personne avertir !**`});
  if (!user.user) user = guild.members.cache.get(user.id);
  if (!user.bannable || user.id == author.id || (user.roles.cache.has("906539625571561523") && !memberPermission.has("ADMINISTRATOR"))) return ({ content: `${database.emojis.close.msg} ** ** **Je ne peux pas avertir cette personne !**`});
  const reason = (interaction instanceof Message ? options.slice(1).map(({ value }) => value).join(" ") : options[1]);
  if (!reason || !options[1]) return ({ content: `${database.emojis.close.msg} ** ** **Je ne peux pas avertir cette personne sans raison !**`});
  try {
    // send message to user
    const msg = await user.send({
      embeds: [
        {
          color: guild.translate("color.sanction"),
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({format: "png", size: 512 }) },
          description: `> **Vous avez été averti(e) par un(e) ${getRole(member.roles.cache)} du serveur ** \`${guild.name}\`${typeof options[1] == "string" ? `\n**Raison:** ${reason}` : ""}\n** **`,
          footer: { text: `Cette sanction a été enregistrée dans la base de donnée.` },
          timestamp: new Date(),
        }
      ]
    }).catch(() => false);
    // warn member ;)
    user.user.ensureData();
    database.users.push(user.id, ({
      date: Date.now(),
      type: "warn",
      reason: reason,
      userId: user.id,
      authorId: author.id,
      guild: guild.id,
      mp: msg ? true : false,
      id: generateId(user.id)
    }), "sanctions")
    // send logs
    sendLogs(user["user"], "warn", reason, author, guild, msg);
    // confirm warn
    return ({ content: `${database.emojis.check.msg} ** ** **${user.user.tag} a été averti(e) !**`});
  } catch(err) {
    return ({ content: `${database.emojis.close.msg} ** ** **Je n'ai pas réussi à avertir ${user.user.tag} !**\n\`\`\`js\n${err.message}\`\`\``});
  }
}

module.exports.config = {
  name: "warn",
  aliase: ["avertissement"],
  category: "moderation",
  defer: true,
  options: [
    { name: "user", description: "L'utilisateur à avertir.", type: 6, required: true },
    { name: "reason", description: "La raison de l'avertissement.", type: 3, required: true }
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