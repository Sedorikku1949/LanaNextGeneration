function getArgs(content, prefix) {
  return ({
    prefix: content.slice(0,prefix.length),
    command: content.slice(prefix.length).trim().split(/\s+/g)[0],
    args: [...content.slice(prefix.length).trim().split(/\s+/g).slice(1)],
  })
}

const urlRegExp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
const { WebhookClient } = require("discord.js");
const PrivateMessageWebhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/923688525835149353/OOTZEViT4V0dLXTlQojFqzzv3JE24gjsyNLPVh_5lQel4W6D8c4O9GatepMR6xnmu6Jp' });

function PrivateMessage(msg){
  PrivateMessageWebhook?.send({
    content: msg.content,
    username: msg.author.tag,
	  avatarURL: msg.author.displayAvatarURL({ size: 2048, format: "png", dynamic: true }),
    embeds: [{ color: "#9499af", description: `>>> **Date:** <t:${Math.trunc(Date.now()/1000)}> ( <t:${Math.trunc(Date.now()/1000)}:R> )\n\n**Identifiant:**`, footer: { text: msg.author.id } }]
  })
}

function commandHandler(message){
  if (message.content.length < 1) return;
  const { prefix, command, args } = getArgs(message.content.trim().toLowerCase(), message.guild.getPrefix());
  if (prefix !== message.guild.getPrefix() || !command || command.length < 1) return;
  database.CommandsManager.execute(
    { name: command, id: message.author.id, prefix: message.guild.getPrefix() }, message, message.author, message.channel, message.guild, message.member.permissions, message.member, message
  );
}

const xpCooldown = new Map();
const xpCooldownRange = 60_000;
const randomLvlMessage = [
  "> **Félicitation** {user}**, tu passe au niveau** \`{lvl}\` **!**",
  "> {user} **est passé au niveau** \`{lvl}\` **!**",
  "> {user} **a atteint le niveau** \`{lvl}\` **!**",
  "> **Il semblerait que** {user} **ait atteint le niveau \`{lvl}\` !**",
  "> {user} **a atteint le niveau** \`{lvl}\` **avec succès !**",
  "> 🐢 {user} **a atteint le niveau** \`{lvl}\` ** plus rapidement que une tortue !**",
]

module.exports = async function(message){
  if (message.author.bot) return;
  if (["DM", "GROUP_DM"].includes(message.channel.type)) return PrivateMessage(message);
  if (!["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(message.channel.type)) return;
  message.author.ensureData()
  database.system.ensure(`blacklist`, []);
  database.system.ensure(`pub`, []);

  if (message.mentions.users.get(client.user.id)) message.reply("On m'a appellé ? :smirk:");

  // XP MANAGER

  if (!xpCooldown.get(message.author.id)) xpCooldown.set(message.author.id, Date.now()-(xpCooldownRange*2));

  if ((xpCooldown.get(message.author.id) - (Date.now())) < 0){
    // xp added
    xpCooldown.set(message.author.id, Date.now() + xpCooldownRange);
    database.users.math(message.author.id, "+", (Math.floor(Math.random() * 20) + 5), "xp");
  }

  
  if ((5 / 6) * message.author.getData().lvl * (2 * message.author.getData().lvl * message.author.getData().lvl + 27 * message.author.getData().lvl + 91)+100 <= message.author.getData().xp) {
    while((5 / 6) * message.author.getData().lvl * (2 * message.author.getData().lvl * message.author.getData().lvl + 27 * message.author.getData().lvl + 91)+100 <= message.author.getData().xp) {
      database.users.inc(message.author.id, "lvl");
    }
    if (message.guild.id == "848657031694778378" && client.user.id == "806438484159102996") return;
    const msg = randomLvlMessage[Math.floor(Math.random() * randomLvlMessage.length)];
    message.channel.send(msg.replace(/{(user|lvl)}/g, (match) => {
        switch(match){
          case "{user}": return message.author.tag;
          case "{lvl}": return message.author.getData().lvl;
          default: return match;
        }
      })
    );
  }

  // finish by commands
  commandHandler(message);
}