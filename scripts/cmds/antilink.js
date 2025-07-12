const fs = require("fs-extra");
const path = require("path");

const configPath = path.join(__dirname, "antilink-config.json");

// ফাইল না থাকলে তৈরি করা
if (!fs.existsSync(configPath)) fs.writeJsonSync(configPath, {});

module.exports = {
  config: {
    name: "antilink",
    aliases: [],
    version: "1.0",
    author: "Azad Vai",
    countDown: 3,
    role: 1, // Admin only
    shortDescription: {
      en: "Block links in group"
    },
    longDescription: {
      en: "Automatically remove any message containing links (Facebook, WhatsApp, Telegram, etc)"
    },
    category: "group",
    guide: {
      en: "{p}antilink on\n{p}antilink off"
    }
  },

  onStart: async function ({ message, args, event }) {
    const config = fs.readJsonSync(configPath);
    const threadID = event.threadID;

    if (!args[0]) {
      return message.reply("📌 Use: antilink on / antilink off");
    }

    const input = args[0].toLowerCase();

    if (input === "on") {
      config[threadID] = true;
      fs.writeJsonSync(configPath, config, { spaces: 2 });
      return message.reply("✅ Anti-link has been ENABLED in this group.");
    }

    if (input === "off") {
      config[threadID] = false;
      fs.writeJsonSync(configPath, config, { spaces: 2 });
      return message.reply("❌ Anti-link has been DISABLED in this group.");
    }

    return message.reply("❗ Invalid option. Use: on / off");
  },

  onChat: async function ({ event, message, api }) {
    const config = fs.readJsonSync(configPath);
    const threadID = event.threadID;
    const senderID = event.senderID;
    const text = event.body;

    if (!config[threadID]) return;
    if (!text) return;

    // লিংক ডিটেকশন Regex
    const linkRegex = /(https?:\/\/|www\.|facebook\.com|chat\.whatsapp\.com|t\.me|youtu\.be|discord\.gg|telegram\.me|\.com|\.net|\.org)/gi;

    if (linkRegex.test(text)) {
      try {
        // অটো ডিলিট
        await api.unsendMessage(event.messageID);

        // ওয়ার্ন মেসেজ
        await message.reply({
          body: `🚫 লিংক শেয়ার করা নিষিদ্ধ!\n\n🛑 User ID: ${senderID}`,
          mentions: [{ tag: "User", id: senderID }]
        });
      } catch (err) {
        console.error("❌ Anti-link failed:", err);
      }
    }
  }
};
