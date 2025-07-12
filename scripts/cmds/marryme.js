module.exports = {
  config: {
    name: "marryme",
    aliases: ["marry", "biye"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: "Get married to someone",
    longDescription: "Mention two users to perform a virtual marriage ceremony",
    category: "fun",
    guide: "{pn} @person1 @person2"
  },

  onStart: async function ({ api, event }) {
    const mentions = Object.keys(event.mentions);
    
    if (mentions.length < 2) {
      return api.sendMessage(
        "💍 দয়া করে বিয়ের জন্য দুইজনকে @mention করুন।\n\nউদাহরণ:\nmarryme @Azad Vai @Tumpa",
        event.threadID,
        event.messageID
      );
    }

    const [id1, id2] = mentions;
    const name1 = event.mentions[id1];
    const name2 = event.mentions[id2];

    const messages = [
      `💘 ${name1} ❤️ ${name2}`,
      "💌 Love detected...",
      "💍 Ring exchanging...",
      "💒 Nikah in progress...",
      "👰🤵 You may now kiss each other!",
      `🎉 Congratulations! ${name1} & ${name2} — you're now *virtually married*! 💖\n📅 Wedding Date: ${new Date().toLocaleDateString()}`
    ];

    let i = 0;
    const sendNext = () => {
      if (i < messages.length) {
        api.sendMessage(messages[i], event.threadID, () => {
          i++;
          setTimeout(sendNext, 1800);
        });
      }
    };

    sendNext();
  }
};
