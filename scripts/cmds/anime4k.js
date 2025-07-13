const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "anime4k",
    aliases: ["4kanime", "animewall"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send a random 4K anime wallpaper"
    },
    longDescription: {
      en: "Get a beautiful 4K anime wallpaper from Wallhaven API"
    },
    category: "image",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const wait = await api.sendMessage("🎌 Finding 4K anime wallpaper...", event.threadID);

    try {
      // Anime-only search with 4K resolution
      const res = await axios.get("https://wallhaven.cc/api/v1/search?q=anime&categories=111&purity=100&resolutions=3840x2160&sorting=random&ai_art_filter=1");

      const imageUrl = res.data.data[0].path;

      const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

      const imgFile = path.join(cachePath, "anime4k.jpg");
      fs.writeFileSync(imgFile, imgRes.data);

      api.sendMessage({
        body: "✨ Here's your 4K anime wallpaper!",
        attachment: fs.createReadStream(imgFile)
      }, event.threadID, () => fs.unlinkSync(imgFile), wait.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Couldn't fetch anime wallpaper. Try again later.", event.threadID, wait.messageID);
    }
  }
};
