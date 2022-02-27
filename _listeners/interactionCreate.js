module.exports = async function(interaction){
  if (interaction.isCommand()) {
    if (!interaction.inGuild()) return;
    return database.CommandsManager.execute(
      { name: interaction.commandName, id: interaction.user.id }, interaction, interaction.user, interaction.channel, interaction.guild, interaction.memberPermissions, interaction.member, interaction
    )
  } else {
    database.InteractionManager.execute(interaction);
  }
}