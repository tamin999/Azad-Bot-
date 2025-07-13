const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "wallpaper",
    aliases: ["4k", "wall"],
    version: "2.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send a random 4K wallpaper"
    },
    longDescription: {
      en: "Get a beautiful high-resolution 4K wallpaper from external API"
    },
    category: "image",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const message = await api.sendMessage("🖼️ Getting your 4K wallpaper...", event.threadID);

    try {
      // Real working wallpaper API (uses Wallhaven.cc)
      const res = await axios.get("https://wallhaven.cc/api/v1/search?categories=111&purity=100&resolutions=3840x2160&sorting=random");

      const imageUrl = res.data.data[0].path;

      const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

      const imgFile = path.join(cachePath, "4k.jpg");
      fs.writeFileSync(imgFile, imgRes.data);

      api.sendMessage({
        body: "✅ Here's your random 4K wallpaper!",
        attachment: fs.createReadStream(imgFile)
      }, event.threadID, () => fs.unlinkSync(imgFile), message.messageID);
    } catch (err) {
      console.log(err);
      api.sendMessage("❌ Could not fetch 4K wallpaper. Try again later.", event.threadID, message.messageID);
    }
  }
};
