const Discord = require("discord.js")
const { parse } = require("querystring");

/**
 * This function give you a Array with a link arguments
 * Be sure to give only arguments !
 * 
 * @param {String} str 
 * @returns {Array}
 */
 function fetchArguments(str){ return Object.entries(parse(str)).map(elm => ({ key: elm[0], value: elm[1] }) ) }

 function getType(int){
   if (int.isButton()) return "BUTTON";
   else if (int.isSelectMenu()) return "SELECT_MENU";
   else if (int.isContextMenu()) return "CONTEXT_MENU";
   else return "UNKNOWN";
 }

class InteractionManager {
  constructor(){
    this.client = client;
    this.database = database;
    this.database.InteractionManager = this;
    return this;
  }

  async execute(interaction) {
    if (!(interaction instanceof Discord.Interaction)) throw new Error("The interaction is not a ButtonInteraction");
    const int = this.database.Interactions.array().find(b => interaction.customId.match(new RegExp(`${b.config.name}(?:&[^\s]+)?`, "gi")) && getType(interaction) == b.config.type);
    if (!int) return;
    // maintenance check
    if (this.database.system.get("maintenance") && ![...database.config.dev.evalAccess, ...database.config.dev.design, ...database.config.whitelist].includes(interaction.user.id)) return interaction.reply({ ephemeral: true, content: "<:close:884084000744939571> ** ** **Je suis actuellement en maintenance, vous ne pouvez pas utiliser mes services.**\n\n**I'm currently in maintenance, you can't use my services.**"});
    try {
      if (int.config.defer) await interaction.deferReply({ ephemeral: true })
      const res = await int.exec(interaction, fetchArguments(interaction.customId.slice(int.config.name.length+1), ));
      if (!global["client"] || !(global["client"] instanceof Discord.Client) || global["client"]?.ws?.destroyed) return;
      if (["string", "object"].some(t => typeof res == t) && !Array.isArray(res)) {
        if (!global["client"] || !(global["client"] instanceof Discord.Client) || global["client"]?.ws?.destroyed) return;
        if (int.config.defer && (type instanceof Discord.CommandInteraction)) {
          interaction.editReply(res);
        } else {
          interaction.reply(res);
        };
      }
    } catch(err) {
      console.log(err);
      if (!global["client"] || !(global["client"] instanceof Discord.Client) || global["client"]?.ws?.destroyed) return;
      if (int.config.defer) interaction.editReply(`:x: **An error as occured !**\n\`\`\`js\n${err.message.slice(0,1500)}\`\`\``).catch(() => false)
      else  interaction.reply(`:x: **An error as occured !**\n\`\`\`js\n${err.message.slice(0,1500)}\`\`\``).catch(() => false)
    }
  }
}

module.exports = InteractionManager;