const fs = require("fs-extra");
const path = require("path");

// ফাইল যেখানে autoresponder ডেটা সেভ হবে
const dataPath = path.join(__dirname, "autorespond.json");

// ফাইল না থাকলে তৈরি করে
if (!fs.existsSync(dataPath)) fs.writeJsonSync(dataPath, {});

module.exports = {
  config: {
    name: "autoresponder",
    aliases: ["ar", "autorespond"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 3,
    role: 1, // Admin only
    shortDescription: {
      en: "Set automatic reply for specific words"
    },
    longDescription: {
      en: "Automatically responds with a message when someone types specific words in chat"
    },
    category: "group",
    guide: {
      en: "{p}autoresponder add [word] = [reply]\n{p}autoresponder del [word]\n{p}autoresponder list"
    }
  },

  onStart: async function ({ message, event, args }) {
    const data = fs.readJsonSync(dataPath);
    const threadID = event.threadID;

    if (!args[0]) {
      return message.reply("📌 Usage:\n➤ add [word] = [reply]\n➤ del [word]\n➤ list");
    }

    const subcommand = args[0].toLowerCase();
    const content = args.slice(1).join(" ");

    // Add new auto-response
    if (subcommand === "add") {
      if (!content.includes("=")) return message.reply("❌ Format: add [word] = [reply]");
      const [word, reply] = content.split("=").map(i => i.trim().toLowerCase());

      if (!data[threadID]) data[threadID] = {};
      data[threadID][word] = reply;

      fs.writeJsonSync(dataPath, data, { spaces: 2 });
      return message.reply(`✅ Auto-response added:\nWhen someone says: "${word}"\nBot will reply: "${reply}"`);
    }

    // Delete auto-response
    if (subcommand === "del") {
      const word = content.trim().toLowerCase();
      if (data[threadID] && data[threadID][word]) {
        delete data[threadID][word];
        fs.writeJsonSync(dataPath, data, { spaces: 2 });
        return message.reply(`🗑️ Deleted auto-response for "${word}"`);
      } else {
        return message.reply("❌ No such word found.");
      }
    }

    // Show list
    if (subcommand === "list") {
      if (!data[threadID] || Object.keys(data[threadID]).length === 0)
        return message.reply("ℹ️ No auto-responses set yet in this group.");

      const list = Object.entries(data[threadID])
        .map(([w, r], i) => `${i + 1}. "${w}" → "${r}"`)
        .join("\n");

      return message.reply(`📄 Auto-response list:\n${list}`);
    }

    return message.reply("❌ Invalid subcommand. Use add/del/list");
  },

  onChat: async function ({ event, message }) {
    const data = fs.readJsonSync(dataPath);
    const threadID = event.threadID;
    const text = event.body?.toLowerCase();

    if (!text || !data[threadID]) return;

    for (const trigger in data[threadID]) {
      if (text.includes(trigger)) {
        return message.reply(data[threadID][trigger]);
      }
    }
  }
};
