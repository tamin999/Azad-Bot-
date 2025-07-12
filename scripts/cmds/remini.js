const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");
const { getStreamFromPath } = global.utils;

module.exports = {
  config: {
    name: "remini",
    version: "1.0",
    author: "Azad Vai",
    countDown: 10,
    role: 0,
    shortDescription: { en: "AI image enhancer like Remini" },
    longDescription: {
      en: "Enhance low-quality or blurry image using AI and return HD image.",
    },
    category: "ai",
    guide: {
      en: "{pn} (reply to a photo)",
    },
  },

  onStart: async function ({ message, event }) {
    const reply = event.messageReply;

    if (!reply || !reply.attachments || reply.attachments.length === 0) {
      return message.reply("📸 Please reply to a photo to enhance it.");
    }

    const attachment = reply.attachments[0];

    if (attachment.type !== "photo") {
      return message.reply("❌ You must reply to a photo only.");
    }

    const imageUrl = attachment.url;
    const downloadPath = path.join(__dirname, "temp", `${Date.now()}_original.jpg`);
    const enhancedPath = path.join(__dirname, "temp", `${Date.now()}_enhanced.jpg`);

    try {
      // Download original image
      const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
      });

      await fs.ensureDir(path.dirname(downloadPath));
      const writer = fs.createWriteStream(downloadPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await message.reply("🛠️ Enhancing image using AI... Please wait...");

      // Prepare form-data
      const form = new FormData();
      form.append("image", fs.createReadStream(downloadPath));

      // Call to public remini API (no key needed for demo)
      const enhance = await axios.post(
        "https://api.remini.dev/v1/enhance",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
          responseType: "arraybuffer",
        }
      );

      fs.writeFileSync(enhancedPath, enhance.data);

      await message.send({
        body: "✨ Enhanced by AI (Remini Style)",
        attachment: await getStreamFromPath(enhancedPath),
      });

      // Cleanup
      fs.unlinkSync(downloadPath);
      fs.unlinkSync(enhancedPath);
    } catch (error) {
      console.error("❌ Remini Error:", error.message);
      return message.reply("❌ Failed to enhance image. Try again later.");
    }
  },
};
