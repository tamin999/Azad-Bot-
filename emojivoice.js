const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const googleTTS = require("google-tts-api");

module.exports = {
  config: {
    name: "emojivoice",
    aliases: ["ev", "emo-voice"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Send emoji as voice" },
    longDescription: { en: "Speak the name/meaning of any emoji sent" },
    category: "fun",
    guide: { en: "{pn} 😍" }
  },

  onStart: async function ({ message, args }) {
    const emoji = args.join(" ").trim();
    if (!emoji) return message.reply("🔊 দয়া করে একটি ইমোজি দিন!");

    try {
      const meaning = await getEmojiMeaning(emoji);
      const speech = `এই ইমোজির মানে হচ্ছে: ${meaning}`;

      const url = googleTTS.getAudioUrl(speech, {
        lang: "bn", // Change to "en" for English voice
        slow: false,
        host: "https://translate.google.com"
      });

      const filepath = path.join(__dirname, "emojiVoice.mp3");
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({
          body: `📢 ${speech}`,
          attachment: fs.createReadStream(filepath)
        });
      });

      writer.on("error", () => {
        message.reply("❌ ভয়েস জেনারেট করতে সমস্যা হয়েছে!");
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ ইমোজির মানে খুঁজে পাওয়া যায়নি!");
    }
  }
};

// 🧠 Emoji থেকে অর্থ বের করার ছোট হেল্পার ফাংশন
async function getEmojiMeaning(emoji) {
  try {
    const res = await axios.get(`https://emoji-api.com/emojis?search=${encodeURIComponent(emoji)}&access_key=your_api_key_here`);
    if (res.data && res.data.length > 0) {
      return res.data[0].unicodeName || "অজানা ইমোজি";
    } else {
      return "অজানা ইমোজি";
    }
  } catch (err) {
    return "অজানা ইমোজি";
  }
}
