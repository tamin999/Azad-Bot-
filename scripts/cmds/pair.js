const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "pair",
    aliases: [],
    version: "2.6",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: "Cute love pair display system",
    longDescription: "Pair with someone (mention/reply/random) and show both profile pics inside one image",
    category: "love",
    guide: "{pn} [@mention or reply or blank]"
  },

  onStart: async function ({ event, usersData, threadsData, message }) {
    const { threadID, senderID, mentions, messageReply } = event;

    let uid1 = senderID;
    let uid2;

    // Detect second user
    if (messageReply) {
      uid2 = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      uid2 = Object.keys(mentions)[0];
    } else {
      const threadInfo = await threadsData.get(threadID);
      const members = threadInfo.members.map(u => u.userID).filter(id => id !== uid1);
      if (members.length === 0) return message.reply("⚠️ Group e onno keu nai pair korar jonno!");
      uid2 = members[Math.floor(Math.random() * members.length)];
    }

    // Get names (with fallback)
    let name1 = await usersData.getName(uid1);
    let name2 = await usersData.getName(uid2);
    if (!name1) name1 = `User ${uid1}`;
    if (!name2) name2 = `User ${uid2}`;

    // Get avatars
    const avatarURL1 = await usersData.getAvatarUrl(uid1);
    const avatarURL2 = await usersData.getAvatarUrl(uid2);

    const pathImg = path.join(__dirname, "cache", `pair_${uid1}_${uid2}.png`);
    const canvas = createCanvas(700, 500);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#10131c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load avatars
    const avatar1 = await loadImage(avatarURL1);
    const avatar2 = await loadImage(avatarURL2);

    // Draw avatars
    ctx.drawImage(avatar1, 100, 100, 200, 200);
    ctx.drawImage(avatar2, 400, 100, 200, 200);

    // ❤️ Small Heart in center with glow
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.shadowColor = "#ff4d4d";
    ctx.shadowBlur = 10;
    ctx.fillText("❤️", 320, 200);

    // Clear shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Names under avatars
    ctx.font = "26px Arial";
    ctx.fillStyle = "#9eeaff";
    const name1Width = ctx.measureText(name1).width;
    const name2Width = ctx.measureText(name2).width;
    ctx.fillText(name1, 200 - name1Width / 2, 330);
    ctx.fillText(name2, 500 - name2Width / 2, 330);

    // Romantic message
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ff8ba7";
    ctx.fillText("💌 I love you only you ❤️", 180, 420);

    // Save and send
    const buffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, buffer);

    return message.reply({
      body: `💖 ${name1} ❤️ ${name2}`,
      attachment: fs.createReadStream(pathImg)
    }, () => fs.unlinkSync(pathImg));
  }
};
