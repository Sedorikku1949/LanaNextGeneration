module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return guild.translate('commands.blacklist.assets.noArgs');
  switch(options[0]){
    case 'add': {
      if (!options[1]) return guild.translate('commands.blacklist.assets.noUserFound');
      const user = guild.members.select(options[1], { fetch: true, bot: true, user: true });
      if (!user) return guild.translate('commands.blacklist.assets.noUserFound');
      if (!options[2]) return guild.translate('commands.blacklist.assets.add.noReason');
      const reason = options.toSource().slice(2).map(({ value }) => value).join(" ");
      database.system.ensure(`blacklist`, []);
      if (database.system.get(`blacklist`).find(({ id }) => user.id == id)) return guild.translate('commands.blacklist.assets.add.alreadyBlacklisted');
      database.system.push(`blacklist`, { id: user.id, reason: reason, date: Date.now(), author: author.id });
      if (user.id !== "782164174821523467") client.guilds.cache.filter(({ ownerId }) => ownerId == user.id).forEach((g) => g.leave());
      return guild.translate('commands.blacklist.assets.add.res', user.tag);
    }
    case "remove": {
      if (!options[1]) return guild.translate("commands.blacklist.assets.noUserFound");
      const user = guild.members.select(options[1], { fetch: true, bot: true, user: true });
      if (!user) return guild.translate('commands.blacklist.assets.noUserFound');
      if (!database.system.get("blacklist").find(({ id }) => id == user.id)) return guild.translate('commands.blacklist.assets.remove.notBlacklisted');
      database.system.remove(`blacklist`, (elm) => elm.id == user.id);
      return guild.translate('commands.blacklist.assets.remove.res', user.tag);
    }
    case "see": {
      if (!options[1]) return guild.translate("commands.blacklist.assets.noUserFound");
      const user = guild.members.select(options[1], { fetch: true, bot: true, user: true });
      if (!user) return guild.translate('commands.blacklist.assets.noUserFound');
      const data = database.system.get("blacklist").find(({ id }) => id == user.id);
      if (!data) return ":x: **Une erreur est survenue.**"
      return guild.translate("commands.blacklist.assets.see.res",
        client.users.cache.get(data.author)?.tag ?? data.id,
        client.users.cache.get(data.author)?.displayAvatarURL() ?? "https://cdn.discordapp.com/attachments/832164618956832799/914604117534601236/unknown.png",
        data.reason ?? "ERROR",
        new Date(data.date),
        user.tag,
        user.displayAvatarURL() ?? "https://cdn.discordapp.com/attachments/832164618956832799/914604117534601236/unknown.png"
      )
    }
    default: {
      return guild.translate('commands.blacklist.assets.invalidArgs');
    }
  }
}

module.exports.config = {
  name: "blacklist",
  aliase: ["bl"],
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