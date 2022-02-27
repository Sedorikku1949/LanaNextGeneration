function generateProgressBar(size, maxSize, length, fillChar = "#", emptyChar = "."){
  if ([size, maxSize, length].some(isNaN)) return "ERROR_BAD_ARGUMENTS";
  let res = "";
  for (let i = 0; i < length; i++) res += (i < size / maxSize * length) ? fillChar : emptyChar;
  return res;
}

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  let user = await (options[0] ? (typeof options[0] !== "string" ? options[0] : guild.members.select(options[0], { bot: true, user: true }) ) : author);
  if (!user && options[0]) return ":x: ** ** **Je ne sais pas quel personne cherchée !**"
  if (!user) return ":x: ** ** **Une erreur est survenue !**"
  if (user["user"]) user = user["user"]
  const averageColor = await (user.displayAvatarURL({size: 256,format:"png"})).averageColor("hex") ?? guild.translate("color.secondary")
  user.ensureData();
  const maxExperience = (5 / 6) * user.getData().lvl * (2 * user.getData().lvl * user.getData().lvl + 27 * user.getData().lvl + 91)+100
  return ({
    embeds: [
      {
        color: averageColor,
        author: { name: user.tag, icon_url: user.displayAvatarURL({format: "png", size: 4096, dynamic: true}) },
        description: `> **Profile de** \`${user.tag}\`\nMarrié avec ${user.getData().marryId && client.users.cache.get(user.getData().marryId) ? client.users.cache.get(user.getData().marryId).tag : "personne"}.\n** **`,
        fields: [
          { name: "Experience :", value: `>>> \`\`\`\n[ ${(((user.getData()?.xp || 0)/maxExperience)*100).toFixed(0)}% ${generateProgressBar(user.getData()?.xp || 0, maxExperience, 20)}]\`\`\`**Lvl:** ${user.getData()?.lvl || 0}\n**XP:** ${(user.getData()?.xp || 0).shortNumber()}`, inline: true },
          { name: "Money :", value: `>>> **Banque:** ${user.getData()?.money?.bank||0}\n**Porte-monnaie:** ${user.getData()?.money?.pocket||0}` }
        ],
        footer: { icon_url: author.displayAvatarURL({format: "png", size: 512, dynamic: true}), text: `Demandé par ${author.tag}` }
      }
    ]
  })
}

module.exports.config = {
  name: "rank",
  aliase: ["profile"],
  category: "user",
  defer: true,
  options: [
    { name: "user", description: "L'utilisateur dont vous voulez voir la photo de profile.", type: 6, required: false }
  ],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: false,
    dev: false,
    inProgress: false,
    isUserCommand: true,
    isSlashCommand: true
  },
  lang: null,
  path: null
}