module.exports = {
  exec: async function (interaction, args) {
    const sanctionId = args.find(({ key }) => key == "sanctionId");
    const user = args.find(({ key }) => key == "user");
    console.log(user)
    if (user.value !== interaction.user.id) return;
    if (!sanctionId) return ({ content: `${database.emojis.close.msg} ** ** **Je n'ai pas trouvé l'identifiant de sanction !**`});
    const sanction = database.users.array().find(({ sanctions }) => sanctions.some(({ id }) => id == sanctionId.value));
    if (!sanction) return ({ content: `${database.emojis.close.msg} ** ** **Je n'ai pas trouvé la sanction !**`});
    return ({
      ephemeral: true,
      content: `**\`SUCCESS - data founds\`**\n\`\`\`js\n${require("util").inspect(sanction.sanctions.find(({ id }) => id == sanctionId.value), false, 1, false)}\`\`\``
    })
  },
  config: {
    name: "SANCTION_RAW",
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
