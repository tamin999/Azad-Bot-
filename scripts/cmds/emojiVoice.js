const fs = require("fs-extra");
const path = require("path");
const googleTTS = require("google-tts-api");

module.exports = {
  config: {
    name: "emojiVoice",
    aliases: ["autovoice", "emovoice"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Auto voice based on emoji"
    },
    longDescription: {
      en: "Replies with voice when certain emoji are detected"
    },
    category: "auto",
    guide: {
      en: "Just send emoji like 😂, 😭, 🥵 etc."
    }
  },

  onChat: async function ({ message, event }) {
    const emojiVoiceMap = {
      "😂": "Azad is laughing like crazy!",
      "😢": "Azad is crying alone tonight.",
      "😭": "Heartbroken Azad Vai is crying again.",
      "😡": "Azad is really angry now!",
      "🥵": "Azad is feeling hot and broken!",
      "🥺": "Azad is feeling emotional right now.",
      "🙂": "Azad is pretending to be okay.",
      "😎": "Azad is in full attitude mode."
    };

    const content = event.body?.trim();
    if (!content || !emojiVoiceMap[content]) return;

    const text = emojiVoiceMap[content];
    const url = googleTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });

    const filepath = path.join(__dirname, "temp.mp3");
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));

    return message.reply({
      body: `🎧 Voice for ${content}`,
      attachment: fs.createReadStream(filepath)
    }, () => fs.unlinkSync(filepath));
  }
};
