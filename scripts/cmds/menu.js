module.exports = {
  config: {
    name: "menu",
    version: "1.0",
    author: "Azad Vai",
    countDown: 3,
    role: 0,
    shortDescription: "Show all available commands",
    longDescription: "Displays the full command list of Goat Bot V2",
    category: "info",
    guide: {
      en: ""
    }
  },

  usePrefix: false, // ✅ Prefix ছাড়া চলবে

  onStart: async function ({ message }) {
    const menu = `
╭──🎯 Goat Bot V2 Menu 🎯──╮
│
├ 🤖 System:
│   • ping
│   • uptime
│
├ 🎮 Fun:
│   • kobita
│   • voice
│   • emoji
│
├ 📸 Media:
│   • tiktok
│   • remini
│
├ 👤 Owner:
│   • owner
│
├ ℹ️ Help:
│   • help
│
╰───────────────╯

👉 Just type the command name, no prefix needed!
    `;
    message.reply(menu);
  }
};
