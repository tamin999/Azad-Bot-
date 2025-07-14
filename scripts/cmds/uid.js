const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uid",
    aliases: ["id"],
    version: "1.1",
    author: "Azad Vai",
    countDown: 3,
    role: 0,
    shortDescription: "Get UID and profile pic",
    longDescription: "Get user UID with profile picture by reply or mention",
    category: "info",
    guide: {
      en: "{pn} [@mention/reply] - Get user UID and profile picture"
    }
  },

  onStart: async function ({ event, message, usersData, api }) {
    let uid;
    let name;

    // If message is a reply
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
      name = event.messageReply.senderID == event.senderID ? "Your" : (await usersData.getName(uid));
    }

    // If someone is mentioned
    else if (event.mentions && Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
      name = await usersData.getName(uid);
    }

    // If nothing, then self UID
    else {
      uid = event.senderID;
      name = "Your";
    }

    // Get avatar
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=720&height=720`;
    const imgPath = path.join(__dirname, "cache", `${uid}.jpg`);

    try {
      const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

      await message.reply({
        body: `${name} UID: ${uid}`,
        attachment: fs.createReadStream(imgPath)
      });

      fs.unlinkSync(imgPath); // Delete after send
    } catch (err) {
      console.error(err);
      message.reply(`${name} UID: ${uid}\n(But couldn't load profile picture)`);
    }
  }
};
