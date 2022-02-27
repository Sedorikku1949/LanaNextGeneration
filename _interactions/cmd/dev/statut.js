module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!database.config.dev.evalAccess) return { content: "<:close:884084000744939571> ** ** **Cette commande est réservée aux développeurs !" };
  if (!options[0]) return { content: "<:close:884084000744939571> ** ** **Je ne sais pas quoi changer dans mon statut.**" };
  switch (options[0]) {
    case "reset": {
      // enable auto state change
      global["client"].autoState = true;
      return { content: "<:check:884084000291971084> ** ** **Le statut a été réinitialisé, il changeras automatiquement désormais.**" };
      break;
    };
    default: {
      const type = options[0].match(/watching|listening|playing|streaming/g) ? options[0].toUpperCase() : "WATCHING";
      global["client"].autoState = false; // disable auto state change
      try {
        global["client"].user.setActivity(options.slice(1).map(({ value }) => value).join(" "), { type, url: "https://www.twitch.tv/sedorriku_" });
        return { content: `<:check:884084000291971084> ** ** **J'ai désormais le statut** \`${options.slice(1).map(({ value }) => value).join(" ")}\` **avec le type** \`${type}\` **!**\n\n> Pour réactiver le changement automatique du statut, écrivez \`=statut reset\`.`};
      } catch(err) { return { content: "<:close:884084000744939571> ** ** **Je n'ai pas pu changer mon statut.**" }; }
    }
  }
}

module.exports.config = {
  name: "statut",
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