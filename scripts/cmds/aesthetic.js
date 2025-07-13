const axios = require("axios");

module.exports = {
  config: {
    name: "aesthetic",
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: "Send aesthetic image",
    longDescription: "Get a random aesthetic wallpaper/photo",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get("https://api.waifu.pics/sfw/waifu");
      message.send({
        body: "🌸 Here's your aesthetic pic:",
        attachment: await global.utils.getStreamFromURL(res.data.url)
      });
    } catch (err) {
      message.reply("❌ Couldn't fetch image. Try again later.");
    }
  }
};
