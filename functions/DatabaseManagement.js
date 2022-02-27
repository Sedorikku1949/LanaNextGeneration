module.exports = {
  guildData: function guildData(id) {
    return {
      id: id,
      lang: "fr",
      prefix: client.prefix ?? "=",
      settings: {},
      creationDate: Date.now(),
    }
  }
}