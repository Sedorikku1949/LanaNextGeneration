module.exports = {
  generateMessage: function(guild, i, author) {
    database.system.ensure("patchnotes", [])
    const data = database.system.get("patchnotes");
    if (!data || !Array.isArray(data)) return ({ content: "> **Je n'ai pas trouvé de notes de mise à jour disponible.**" });
    let index = (i) % data.length;
    if (!data[index]) return ({ content: "> **Il n'y a aucune actualitée pour le moment.**" });
    const auth = client.users.cache.get(data[index].authorId);
    return ({
      embeds: [
        {
          author: { name: auth?.username || "Kady#0658", iconURL: auth?.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png" },
          title: data[0].title,
          description: data[0].description,
          color: "#9499af",
          timestamp: new Date(data[index].date ?? Date.now()),
          footer: { text: `Page ${index+1}/${data.length}` },
          thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) },
        }
      ],
      components: [
        {
          type: 1,
          components: [
            { disabled: data.length < 2, emoji: "885157955241115698", label: "", style: 2, type: 2, custom_id: `PATCH_UNDO&id=${index}&user=${author.id}` },
            { disabled: data.length < 2, emoji: "885157955459235870", label: "", style: 2, type: 2, custom_id: `PATCH_REDO&id=${index}&user=${author.id}` },
            { disabled: false, emoji: "885157955270488084", label: "", style: 2, type: 2, custom_id: `MSG_DELETE&id=${index}&user=${author.id}` },
          ],
        },
        {
          type: 1, components: [
            { disabled: true, label: "Afficher sur mon site web", style: 5, type: 2,  url: "https://kady.tlkoe.xyz/news", }
          ]
        }
      ]
    })
  }
}