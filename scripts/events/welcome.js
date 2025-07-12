const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "welcome",
    version: "1.0",
    author: "Azad Vai",
    role: 0,
    shortDescription: { en: "Auto welcome new members" },
    longDescription: { en: "Sends welcome message when someone joins the group" },
    category: "group",
    guide: { en: "No command needed. Runs automatically when someone joins." }
  },

  // Auto trigger when someone joins the group
  onEvent: async function ({ event, message, usersData, threadsData }) {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const addedMembers = event.logMessageData.addedParticipants;

    const threadData = await threadsData.get(threadID);
    const memberCount = Object.keys(threadData.members).length;

    for (const member of addedMembers) {
      const name = member.fullName;
      const uid = member.userFbId;
      const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A - DD/MM/YYYY - dddd");

      const welcomeText = `👋 Hello ${name}\n🎉 Welcome to 𝙂𝙍𝙊𝙐𝙿 𝘾𝙃𝘼𝙏 𝘽𝙊𝙏 𝘾𝙆!\n🧑‍🤝‍🧑 You're the ${memberCount}ᵗʰ member in this group. Please enjoy your stay.\n━━━━━━━━━━━━━━━━\n📅 ${time}`;

      message.send(welcomeText, threadID);
    }
  }
};
