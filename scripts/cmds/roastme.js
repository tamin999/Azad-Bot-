const roasts = [
  "Tui je pagol, seta doctor er certificate diya proof kora jabe 🧠",
  "Toke dekhle net slow hoye jai, tor face buffering e thake 😭",
  "Tui jokhon janmo nisil, Google e search bar error dise 🤖",
  "Tor brain ta onek rare... karon eita pray use e ase na 😜",
  "Tui jodi ekta app hoitas, taile rating ditam 1 star with bugs 🐞",
  "Tor mathay brain nai, only ‘Loading...’ lekha dekha jay 🌀",
  "Toke jokhon coding shikhano hocchilo, tui spelling mistake korsil 🙃",
  "Tor memory RAM er moto — kichui dhore rakhte paros na 😆",
  "Toke jokhon dekhbo, antivirus scan chalamu 🤒",
  "Tor logic ta calculator chara kaj kore na 😎"
];

module.exports = {
  config: {
    name: "roast",
    aliases: ["roastme", "roastyou"],
    version: "1.0",
    author: "Azad Vai",
    role: 0,
    cooldown: 5,
    shortDescription: "Roast your friends 😈",
    longDescription: "Sends a funny Banglish roast to you or mentioned user",
    category: "fun",
    guide: {
      en: "{pn} [@mention]",
      bn: "{pn} [@mention]"
    }
  },

  onStart: async function ({ message, event }) {
    const mentionID = Object.keys(event.mentions || {})[0];
    const name = mentionID ? event.mentions[mentionID] : null;

    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    const target = name ? `${name.replace(/@/g, "")}` : "Tui";

    message.reply(`🔥 ${target}, ${roast}`);
  }
};
