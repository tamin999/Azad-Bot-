const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    aliases: ["creator", "admin", "মালিক"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Show bot owner information"
    },
    longDescription: {
      en: "Display detailed info about the bot owner/creator"
    },
    category: "info",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, api }) {
    const ownerImagePath = path.join(__dirname, "owner.jpg");

    // যদি owner.jpg না থাকে তবে ফটো সিস্টেম স্কিপ করবে
    let attachment = [];
    if (fs.existsSync(ownerImagePath)) {
      attachment.push(fs.createReadStream(ownerImagePath));
    }

    const msg = {
      body: `
👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑

🔰 Name: Yoʋʀ ʌzʌɗ
🌐 Facebook: fb.com/https://www.facebook.com/profile.php?id=61577896330591
💻 GitHub: github.com/https://github.com/Bot-azad/Azad-Bot-.git
📞 Contact: wa.me/880197476****
🛠️ Developer & Founder of Goat Bot V2

📢 🎀𝗔𝘇𝗮𝗱 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁 🎀 💖
      `.trim(),
      attachment
    };

    return message.reply(msg);
  }
};
