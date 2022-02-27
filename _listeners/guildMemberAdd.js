const Discord = require("discord.js");

module.exports = function guildMemberAdd(member){
  if (!(member instanceof Discord.GuildMember)) return console.warn("guildMemberAdd: member is not a GuildMember");
  
  if (member.guild.id == "899038919935528991") member.roles.add("899042346090508318").catch(() => false) && member.user.send({
    embeds: [
      {
        title: "Bienvenue !",
        author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({ size: 512, format: "png" }) },
        description: `👋 Bienvenue mon serveur officiel nommé \`${member.guild.name}\` !\n\n> J'espère que tu vas passer un bon moment ici.\n> Si tu as des questions, n'hésites pas à contacter mes développeurs !\n** **`,
        footer: { text: "Ce message est automatique et conçu pour ce serveur." },
        color: "#959ab0"
      }
    ],
    components: [
      { type: 1, components: [{ disabled: true, label: `Envoyer depuis ${member.guild.name}`, style: 2, type: 2, custom_id: `BLEP` }] },
      {
        type: 1, components: [
          { disabled: false, label: "Inviter moi maintenant !", style: 5, type: 2,  url: "https://kady.tlkoe.xyz/invite", },
          { disabled: false, label: "Accéder à mon Dashboard", style: 5, type: 2,  url: "https://kady.tlkoe.xyz/", },
        ]
      }
    ]
  }).catch(() => false);

  if (typeof member?.guild?.getData()?.logs?.guildMemberAdd?.channel == "string") {
    client.channels.cache.get(member.guild.getData().logs.guildMemberAdd.channel)
      .send(member.guild.translate(
        "logs.guildMemberAdd",
        member.user.tag, member.displayAvatarURL({ size: 512, format: "png", dynamic: true }),
        member.displayAvatarURL({ size: 1024, format: "png", dynamic: true }),
        Math.trunc(member.user.createdTimestamp/1000),
        (member.user.bot ? database.emojis.check?.msg || "✅" : database.emojis.close?.msg || "❌"),
        member.id, new Date(),
        member.displayAvatarURL({ size: 4096, format: "png", dynamic: true }),
      )).catch(() => null);
  }
}