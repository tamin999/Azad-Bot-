module.exports = {
  config: {
    name: "hackyou",
    aliases: ["fakehack", "hacker"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: "Fake hacking animation on user",
    longDescription: "Prank someone with a fake hacking sequence",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ api, event, args }) {
    const mention = Object.keys(event.mentions)[0] || event.senderID;
    const targetName = event.mentions[mention] || "User";

    const steps = [
      "🟢 Connecting to Facebook servers...",
      "🔍 Searching user info...",
      "📥 Downloading private data...",
      "📂 Accessing messages...",
      "📸 Collecting embarrassing photos...",
      "💳 Cracking saved card info...",
      "📡 IP traced: 192.168.0.1",
      "📤 Uploading to dark web...",
      "❌ FBI alert triggered!",
      "✅ Hack complete!"
    ];

    let i = 0;

    const sendNext = () => {
      if (i < steps.length) {
        api.sendMessage(`👾 Hacking ${targetName.replace("@", "")}...\n${steps[i]}`, event.threadID, () => {
          i++;
          setTimeout(sendNext, 1500);
        });
      } else {
        api.sendMessage(`💀 ${targetName.replace("@", "")} has been fully hacked. RIP privacy! 🤖`, event.threadID);
      }
    };

    sendNext();
  }
};
