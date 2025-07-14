const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "detectprofile",
    aliases: ["dp", "profileai", "whoami"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: "Analyze your full profile",
    longDescription: "AI-generated user profile scan including danger level, IQ, aura, fame & more.",
    category: "premium",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const userID = event.senderID;
    const profileLink = `https://facebook.com/${userID}`;
    const time = moment().tz("Asia/Dhaka").format("HH:mm:ss || DD-MM-YYYY");

    // Simulate dynamic values
    const IQ = Math.floor(Math.random() * 80) + 90;
    const fame = ["Unknown", "Local", "Trending", "Celebrity", "Viral", "Iconic"][Math.floor(Math.random() * 6)];
    const danger = ["😇 Safe", "😏 Mischievous", "🔥 Dangerous", "☠️ Killer Vibes", "💀 Most Wanted"][Math.floor(Math.random() * 5)];
    const aura = ["🔵 Calm", "🟢 Nature", "🔴 Fire", "🟣 Mystic", "⚫ Shadow", "⚪ Light"][Math.floor(Math.random() * 6)];

    let genderGuess = "Unknown";
    try {
      const info = await api.getUserInfo(userID);
      const name = info[userID].name;
      genderGuess = name.endsWith("a") || name.endsWith("i") ? "👩 Female (guessed)" : "👨 Male (guessed)";
    } catch (e) {
      genderGuess = "❓ Unknown";
    }

    // Optional: Get IP-based location
    let locationText = "🌍 Location: Unknown";
    try {
      const loc = await axios.get("https://ipapi.co/json/");
      locationText = `🌍 Location: ${loc.data.city}, ${loc.data.country_name}`;
    } catch (e) {}

    const msg =
`🧠 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗦𝗰𝗮𝗻 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲

👤 User ID: ${userID}
🔗 Profile: ${profileLink}
🙋 Gender: ${genderGuess}

📈 IQ Level: ${IQ}
🌟 Fame: ${fame}
☠️ Danger Level: ${danger}
✨ Aura: ${aura}
🕒 Time: ${time}
${locationText}

🛡️ Analysis done by Azad's Cyber AI 🔍`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
