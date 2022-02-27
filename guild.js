module.exports = (guild) => ({
  prefix: guild.id !== "848657031694778378" ? "." : "=",
  lang: "fr",
  id: guild.id,
  settings: {
    ignoredChannel: [],
    ignoredChannels: [
      "906539333455069236",
      // salon test
      "876863336015347743"
    ],
    ignoredRole: [
      "906538787423785061",
      "906539638771036170",
      "906539634312511559",
      // test role
      "847231055211921419"
    ],
      staffRole: [
      "906539625571561523",
      "906539595217391657",
      "906539604876857475",
      "906539608039358464",
      "906539608379101295",
      "906539621549215777",
      "944636126528950333",
      "912083762525904937",
      // test role
      "869550620678434816"
    ]
  },
  logs: {
    messageDelete: {
      channel: "896792639343575130"
    },
    messageUpdate: {
      channel: "896792639343575130"
    },
    guildMemberAdd: {
      channel: "896792639343575130"
    },
    guildMemberRemove: {
      channel: "896792639343575130"
    },
    guildBanAdd: {
      channel: "896792639343575130"
    },
    guildBanRemove: {
      channel: "896792639343575130"
    }
  }
})