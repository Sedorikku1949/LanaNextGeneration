module.exports = {
  exec: async function (interaction, args) {
    const cmd = args.find(({ key }) => key == "cmd");
    const user = args.find(({ key }) => key == "user");
    if (!(cmd instanceof Object) || !(user instanceof Object) || interaction.user.id !== user?.value || !database.commands.get(cmd?.value)) return;
    try {
      const pth = database.commands.get(cmd?.value)?.config?.path
      if (!pth) return "> ** ** **Une erreur est survenue en récupérant le chemin de la commande.**";
      delete require.cache[require.resolve(`../../../${pth}`)];
      database.commands.delete(cmd?.value);
      const data = require(`../../../${pth}`);
      data.config.path = pth;
      database.commands.set(cmd?.value, data);
      return `> <:check:884084000291971084> ** ** **La commande **\`${cmd?.value}\`** a été rechargée avec succès.**`;
    } catch(err) {
      console.error(err);
      return "> ** ** **Une erreur est survenue.**\n```js\n"+err.message+"```";
    }
  },
  config: {
    name: "RELOAD_CMD",
    defer: false,
    permissions: {
      user: "NONE",
      bot: "NONE",
    },
    args: [],
    type: "BUTTON",
    description: "Dev only slurp",
    hidden: true,
  },
};
