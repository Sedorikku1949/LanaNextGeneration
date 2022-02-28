const Discord = require("discord.js")
const { getArgs } = require("../../functions/Managers.js");
const { color } = require("../../functions/Utils")

const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));

function notDev(author, interaction, command) {
  console.log(`\x1B[31m[ WARNING ] >> Tentative d'execution de la commande ${command.config.name || "UNKNOW"} par ${author.tag} à ${dayjs(new Date()).tz(dayjs.tz.guess()).format("DD/MM/YYYY hh:mm a ss:ms")}\x1B[0m`)
}

class CommandsHandler {
  constructor(){
    this.client = client;
    this.database = database;
    this.database.CommandsManager = this;
    return this;
  }

  async execute(actionDetail, type, ...args){
    if ((type.channel.isIgnored() || type.guild.members.cache.get(actionDetail.id)?.isIgnored()) && (!type.guild.members.cache.get(actionDetail.id)?.isStaff() || ![...database.config.dev.evalAccess].includes(actionDetail.id)))
      return;
    if ([...this.database.system.get("blacklist"), ...this.database.system.get("tdkBlacklist").filter((blTDK) => blTDK.certified)].some(e => e.id == actionDetail.id) && ![...database.config.dev.evalAccess].includes(actionDetail.id)) return type.reply({ ephemeral: true, content: "<:close:884084000744939571> ** ** **Vous êtes blacklist, l'accès à mes services vous as été retiré.**"});
    // args check
    if (typeof actionDetail !== "object" || Array.isArray(actionDetail) || [Discord.CommandInteraction, Discord.Message].every((cls) => !(type instanceof cls) ) || !args || args.length < 1)
      throw new Error("Invalid values has been provided !")

    type.guild?.ensureData();

    // command finder
    const command = this.database.commands.array().find(cmd => cmd.config.name == actionDetail.name || cmd.config.aliase?.includes(actionDetail.name))
    if (!command) return

    if ((command?.config?.system?.dev || command.config.category == "dev") && !database.config.dev.evalAccess.includes(actionDetail.id)) return notDev(client.users.cache.get(actionDetail.id) ?? type.author, type, command);
    if (command?.config?.system?.staff && !type.guild.members.cache.get(actionDetail.id)?.isStaff()) return ((type instanceof Discord.Message) ? type.react("❌").catch(() => false) : null)

    // maintenance verification
    if (this.database.system.get("maintenance") && ![...database.config.dev.evalAccess, ...database.config.dev.design, ...database.config.whitelist].includes(actionDetail.id)) return type.reply("<:close:884084000744939571> ** ** **Je suis actuellement en maintenance, vous ne pouvez pas utiliser mes services.**\n\n**I'm currently in maintenance, you can't use my services.**");
    
    // cooldown
    if (database.cooldown.command[actionDetail.id] > Date.now()) return
    else database.cooldown.command[actionDetail.id] = Date.now() + 1000

    // execute
    let state = 0;
    try {
      if (command.config.defer && (type instanceof Discord.CommandInteraction)) await type.deferReply({ ephemeral: command.config.ephemeral ?? false})
      if (command.config.defer && (type instanceof Discord.Message)) type.channel.sendTyping();
      const res = await command.exec(...args, getArgs(type, client.prefix.length));
      if (!global["client"] || !(global["client"] instanceof Discord.Client) || global["client"]?.ws?.destroyed) return;
      if (["string", "object"].some(t => typeof res == t) && !Array.isArray(res)) {
        if (!global["client"] || !(global["client"] instanceof Discord.Client) || global["client"]?.ws?.destroyed) return;
        if (command.config.defer && (type instanceof Discord.CommandInteraction)) {
          type.editReply(res)
        } else {
          type.reply(res)
        };
      }
    } catch(err) {
      state = 1;
      console.log(err);
      if (!global["client"] || !(global["client"] instanceof Discord.Client) || global["client"]?.ws?.destroyed) return;
      if (command.config.defer && (type instanceof Discord.CommandInteraction)) type.editReply(`:x: **An error as occured !**\n\`\`\`js\n${err.message.slice(0,1500)}\`\`\``).catch(() => false)
      else type.reply(`:x: **An error as occured !**\n\`\`\`js\n${err.message.slice(0,1500)}\`\`\``).catch(() => false)
    }

    console.log(color(`{magenta}{ COMMAND }{stop} >> Command {blue}${command.config.name}{stop} executed by {yellow}${client.users.cache.get(actionDetail.id)?.tag || actionDetail.id} (${actionDetail.id}){stop} in {cyan}${type.channel.name} ( ${type.channel.id} ){stop} at {lightgreen}${dayjs(new Date()).tz(dayjs.tz.guess()).format("DD/MM/YYYY hh:mm a ss:ms")}{stop} with code ${state} ( ${state < 1 ? "{green}SUCCESS" : "{red}ERROR"}{stop} ){stop}`));
  }
}

module.exports = CommandsHandler;