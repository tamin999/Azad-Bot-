const fs = require("fs-extra");
const path = require("path");
const { getStreamFromURL } = global.utils;

const WELCOME_FILE = path.join(__dirname, "welcome.json");

module.exports = {
  config: {
    name: "welcome",
    version: "2.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Welcomes new members with custom message and image" },
    longDescription: {
      en: "Automatically welcomes new users with a customizable message and optional welcome image",
    },
    category: "group",
    guide: {
      en:
`📌 Welcome Command Guide:
{pn} set <your message> - Set custom welcome text
{pn} image <url> - Set welcome image
{pn} reset - Reset to default

🔁 Variables you can use:
{name} → New member name
{threadName} → Group name`
    },
  },

  onStart: async function ({ message, event, args }) {
    if (!fs.existsSync(WELCOME_FILE)) fs.writeJsonSync(WELCOME_FILE, {});
    let welcomeData = fs.readJsonSync(WELCOME_FILE);
    const threadID = event.threadID;

    const subCommand = args[0]?.toLowerCase();

    if (!subCommand) {
      return message.reply(
        "📌 Commands:\n" +
        "- welcome set <your message>\n" +
        "- welcome image <image_url>\n" +
        "- welcome reset\n\n" +
        "📌 Variables:\n{name} = User name\n{threadName} = Group name"
      );
    }

    switch (subCommand) {
      case "set": {
        const customMessage = args.slice(1).join(" ");
        if (!customMessage) return message.reply("⚠️ Provide the welcome message.");
        welcomeData[threadID] = welcomeData[threadID] || {};
        welcomeData[threadID].message = customMessage;
        fs.writeJsonSync(WELCOME_FILE, welcomeData);
        return message.reply("✅ Welcome message has been saved.");
      }

      case "image": {
        const imageURL = args[1];
        if (!imageURL || !imageURL.startsWith("http")) return message.reply("⚠️ Provide a valid image URL.");
        welcomeData[threadID] = welcomeData[threadID] || {};
        welcomeData[threadID].image = imageURL;
        fs.writeJsonSync(WELCOME_FILE, welcomeData);
        return message.reply("🖼️ Welcome image URL saved!");
      }

      case "reset": {
        delete welcomeData[threadID];
        fs.writeJsonSync(WELCOME_FILE, welcomeData);
        return message.reply("♻️ Welcome settings reset.");
      }

      default:
        return message.reply("❌ Invalid command. Use `welcome set`, `welcome image`, or `welcome reset`.");
    }
  },

  onEvent: async function ({ event, message, threadsData }) {
    if (event.logMessageType !== "log:subscribe") return;
    if (!fs.existsSync(WELCOME_FILE)) return;
    
    const welcomeData = fs.readJsonSync(WELCOME_FILE);
    const threadID = event.threadID;
    const threadName = (await threadsData.get(threadID))?.threadName || "this group";
    const config = welcomeData[threadID];
    if (!config) return;

    const addedUsers = event.logMessageData.addedParticipants.map(u => u.fullName);
    const mentions = event.logMessageData.addedParticipants.map(user => ({
      tag: user.fullName,
      id: user.userFbId
    }));

    let text = config.message || "👋 Welcome {name} to {threadName}!";
    text = text.replace("{name}", addedUsers.join(", ")).replace("{threadName}", threadName);

    const imageURL = config.image;
    let attachment = null;

    if (imageURL) {
      try {
        attachment = await getStreamFromURL(imageURL);
      } catch (err) {
        console.error("⚠️ Image load failed:", err.message);
      }
    }

    return message.send({
      body: text,
      mentions,
      attachment
    });
  }
};
