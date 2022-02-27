function generateSommaireList(){
  return getAllCategory(database.commands.array()).map((c) => ({ config: { name: c } }) );
}

function getAllCategory(arr){
  let ctg = [];
  arr.forEach(function(item){
    if (!ctg.includes(item.config.category)) ctg.push(item.config.category);
  });
  return ["sommaire", ...ctg].filter((c) => c !== "dev");
}

function getCategoryCommands(commands, ctg){
  console.log(ctg)
  if (!Array.isArray(commands) || typeof ctg !== "string") throw new Error("Invalid arrays was provided, cannot sort commands with categories provided");
  if (ctg == "sommaire") return [...generateSommaireList()];
  return [...commands.filter(cmd => cmd.config.category === ctg)];
}

module.exports = {
  getAllCategory: getAllCategory,
  sortCommand: function sortCommand(commands, ctg){
    if (!Array.isArray(commands) || !Array.isArray(ctg)) throw new Error("Invalid arrays was provided, cannot sort commands with categories provided");
    let obj = {};
    ctg.forEach((c) => obj[c] = []);
    commands.forEach((cmd) => {
      if (!obj[cmd.config.category]) obj[cmd.config.category] = [];
      obj[cmd.config.category].push(cmd);
    });
    return obj;
  },
  getCategoryCommands: getCategoryCommands,
  generateCategoryStringList: function generateCategoryStringList(ctg, actualCategory){
    if (!Array.isArray(ctg) || ctg.some(c => typeof c !== "string")) throw new Error("Invalid categories was provided, cannot generate category string list");
    if (typeof actualCategory !== "string") throw new Error("Invalid actual category was provided, cannot generate category string list");
    const goto = ctg.indexOf(actualCategory) + 1;
    return ctg.map((t, i, arr)=>(goto===1&&i===2?false:i>goto) || (goto===arr.length&&i===arr.length-3?false:i<goto-2)?((goto===arr.length?i===goto-4:i===goto-3)?`(+${i+1})`:(goto===1?i===goto+2:i===goto+1)?`(+${arr.length-(i)})`:false):i+1===goto?`**__${t}__**`:`\`${t}\``).filter(Boolean).join(" - ")
  },
  generateCommandStringList: function generateCommandStringList(cmds, ctg, noCommandTxt = "Aucune commande."){
    if (!Array.isArray(cmds)) throw new Error("Invalid commands was provided, cannot generate command string list");
    return `\`\`\`js\n${cmds.length > 0 ? "" : noCommandTxt}${cmds.map((c, index) => (index+1)+". "+c.config.name).join("\n")}\n\`\`\``
  },
  sendSpecificCommandHelp: function sendSpecificCommandHelp(cmd, guild){
    if (cmd.config.category == "dev") return { content: "⛔ **`ACCESS_DENIED_BY_SYSTEM`**" }
    return ({
      embeds: [{
        author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({ size: 512, format: "png" }) },
        title: guild.translate("misc.help.specificCommand", cmd.config.name),
        color: guild.translate("color.primary"),
        fields: [
          { name: guild.translate("misc.help.fields.aliase"), value: "```\n"+(cmd.config.aliases?.length > 0 ? cmd.config.aliases.join(", ") : "Aucun aliase.")+"```", inline: true },
          { name: guild.translate("misc.help.fields.ctg"), value: "```\n"+(guild.translate(`misc.category['${cmd.config.category}']`) ?? "...")+"```", inline: true },
          { name: guild.translate("misc.help.fields.desc"), value: "```\n"+(guild.translate(`commands['${cmd.config.name}'].desc`) ?? "...")+"```", inline: false },
          { name: guild.translate("misc.help.fields.use"), value: "```\n"+(guild.translate(`commands['${cmd.config.name}'].use`)?.replace(/\$1/g, guild.getPrefix()) ?? "...")+"```", inline: false },
        ]
      }],
      components: guild.translate("misc.help.DashComponents"),
      ephemeral: true,
    })
  }
}