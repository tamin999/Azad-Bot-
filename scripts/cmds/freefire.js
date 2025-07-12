const axios = require("axios");

module.exports = {
  config: {
    name: "freefire",
    aliases: ["ff"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: "Free Fire player info",
    longDescription: "Check Free Fire player info by UID",
    category: "game",
    guide: "{pn} <Free Fire UID>"
  },

  onStart: async function ({ api, event, args }) {
    const uid = args[0];
    if (!uid || isNaN(uid)) {
      return api.sendMessage("❌ দয়া করে একটি সঠিক Free Fire UID দিন।\n📌 উদাহরণ: freefire 123456789", event.threadID, event.messageID);
    }

    try {
      // 🔗 API Link (no key needed)
      const res = await axios.get(`https://freefire-api-v2.vercel.app/api/user/${uid}`);
      const info = res.data;

      if (!info || info.status === false) {
        return api.sendMessage("❌ ইউজার খুঁজে পাওয়া যায়নি। সঠিক UID দিন।", event.threadID, event.messageID);
      }

      const msg = `🔥 Free Fire Player Info 🔥
━━━━━━━━━━━━━━━
👤 Name: ${info.name}
🆔 UID: ${info.uid}
🏆 Level: ${info.level}
🎖️ Rank: ${info.rank}
⚔️ Total Kills: ${info.total_kills}
🎮 Matches Played: ${info.matches_played}
🎯 Headshots: ${info.headshots}
🥇 Win Rate: ${info.win_rate}
📊 K/D Ratio: ${info.kd_ratio}
━━━━━━━━━━━━━━━`;

      return api.sendMessage(msg, event.threadID, event.messageID);
    } catch (e) {
      console.log(e);
      return api.sendMessage("⚠️ সার্ভারে সমস্যা হচ্ছে বা UID ভুল। একটু পরে চেষ্টা করুন।", event.threadID, event.messageID);
    }
  }
};
