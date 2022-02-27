module.exports = {
  exec: async function(interaction, args) {
    const id = args.find(({ key }) => key === 'id');
    if (!id || id.value !== interaction.user.id) return;
    interaction.message?.delete().catch(() => false)
  },
  config: {
    name: "MSG_DELETE",
    defer: false,
    permissions: {
      user: 'NONE',
      bot: 'NONE'
    },
    args: [],
    type: "BUTTON",
    description: 'Deletes the message that triggered the button.',
    hidden: true
  }
}

