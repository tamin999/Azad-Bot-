module.exports = {
  config: {
    name: "antispamemoji",
    version: "1.0",
    author: "Azad Vai",
    role: 0,
    shortDescription: "Kick if too many emojis",
    longDescription: "Kick members who send more than 3 emojis in one message",
    category: "auto",
    guide: "No prefix needed. Works automatically."
  },

  onChat: async function ({ api, event }) {
    try {
      const content = event.body;
      if (!content) return;

      // Emoji detector
      const emojiRegex = /[\p{Emoji}]/gu;
      const found = content.match(emojiRegex) || [];

      if (found.length >= 3) {
        const thread = await api.getThreadInfo(event.threadID);
        const isSenderAdmin = thread.adminIDs.some(e => e.id === event.senderID);
        const isBotAdmin = thread.adminIDs.some(e => e.id === api.getCurrentUserID());

        if (!isBotAdmin)
          return api.sendMessage("⚠️ আমি অ্যাডমিন না, তাই কাউকে কিক করতে পারছি না!", event.threadID);

        if (isSenderAdmin)
          return; // admin হলে কিছু করবে না

        // remove user
        await api.removeUserFromGroup(event.senderID, event.threadID);
        return api.sendMessage(`❌ অতিরিক্ত ইমোজি দেওয়ায় ইউজারকে রিমুভ করা হলো।`, event.threadID);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
