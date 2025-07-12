module.exports = {
  config: {
    name: "pair",
    aliases: ["love", "match"],
    version: "1.0",
    author: "Azad Vai",
    role: 0,
    shortDescription: "Make a love pair",
    longDescription: "Make a love pair between 2 users",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ api, event, usersData }) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const allMembers = threadInfo.participantIDs.filter(id => id != api.getCurrentUserID());

    const targetUID = Object.keys(event.mentions)[0] || event.senderID;
    const targetName = Object.values(event.mentions)[0] || "You";

    // pick a random partner
    const others = allMembers.filter(id => id != targetUID);
    const partnerID = others[Math.floor(Math.random() * others.length)];
    const partnerData = await usersData.get(partnerID);
    const partnerName = partnerData.name || "Unknown";

    const lovePercent = Math.floor(Math.random() * 100) + 1;

    const loveMessage = [
      "❤️ Perfect Match!",
      "💘 Cupid approved!",
      "💔 Maybe... maybe not?",
      "🔥 Chemistry detected!",
      "🧊 Cold... but cute!",
      "✨ Unexpected combo!",
      "💞 Born for each other!",
    ];

    const finalMessage = `
💘 𝗟𝗢𝗩𝗘 𝗣𝗔𝗜𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 💘
━━━━━━━━━━━━━━━━━━━
👤 ${targetName} 💞 ${partnerName}
❤️ Love Match: ${lovePercent}%
💬 Status: ${loveMessage[Math.floor(Math.random() * loveMessage.length)]}
━━━━━━━━━━━━━━━━━━━
🔮 Powered by Azad Vai's Matchmaker Bot
`.trim();

    return api.sendMessage(finalMessage, event.threadID, event.messageID);
  }
};
