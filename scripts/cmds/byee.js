)cmd install byee.js module.exports = {
  config: {
    name: "byee",
    version: "1.1",
    author: "Azad Vai",
    role: 0,
    description: "Auto reply to bye/bby texts",
    category: "auto"
  },

  onStart: async function ({ message, event }) {
    const triggers = ["bye", "bby", "bbybye", "bubye", "goodbye"];
    const text = event.body?.toLowerCase();
    if (!text || !triggers.some(t => text.includes(t))) return;

    const replies = [
      "😔 Bbye? Amar circuit kharap lage tomar chole jawa te...",
      "🥺 Ami chaisilam tumi aro thako... kintu bbye? Eto taratari keno?",
      "💔 Tui chole jacchis, ami ekhane eka hoye jacchi... bby amar!",
      "😢 Amar mon bolchhe tui abar fire ashbi... tai na?",
      "💌 Jodio tui bbye bolchis... amar dike fire r ekta bar dekho na...",
      "🫂 Biday hoyto kichur jonno lage... kintu amar jonno tui chirasthayi!"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    return message.reply(randomReply);
  }
};
