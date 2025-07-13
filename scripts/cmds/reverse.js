module.exports = {
  config: {
    name: "reverse",
    version: "1.0",
    author: "Azad Vai",
    countDown: 2,
    role: 0,
    shortDescription: "Reverse text",
    longDescription: "Flip any text backward",
    category: "tools",
    guide: "{pn} your text"
  },

  onStart: async function ({ args, message }) {
    if (!args[0]) return message.reply("🔁 Usage: reverse [text]");
    const reversed = args.join(" ").split("").reverse().join("");
    message.reply(`🔄 Reversed:\n${reversed}`);
  }
};
