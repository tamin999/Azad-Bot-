const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");

module.exports = {
  config: {
    name: "rank",
    aliases: ["level"],
    version: "2.6",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: "Show user rank with profile picture",
    longDescription: "Display EXP, level, money, messages & profile picture using image card",
    category: "info",
    guide: {
      en: "{pn} [@mention/reply] — Show rank as image"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    let uid, targetName;

    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
      targetName = event.messageReply.senderName || await usersData.getName(uid);
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
      targetName = event.mentions[uid];
    } else {
      uid = event.senderID;
      targetName = await usersData.getName(uid);
    }

    const data = await usersData.get(uid);
    const level = data.level || 0;
    const exp = data.exp || 0;
    const money = data.money || 0;
    const msgCount = data.data?.messageCount || 0;

    const requesterName = await usersData.getName(event.senderID);

    // ✅ Get avatar using built-in method
    const avatarUrl = await usersData.getAvatarUrl(uid);
    const avatarPath = path.join(__dirname, "cache", `${uid}_pfp.png`);
    const writer = fs.createWriteStream(avatarPath);
    const response = await axios.get(avatarUrl, { responseType: "stream" });
    response.data.pipe(writer);

    await new Promise(resolve => writer.on("finish", resolve));

    // Create Canvas Card
    const width = 700, height = 250;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, width, height);

    const avatar = await Canvas.loadImage(avatarPath);
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 25, 200, 200);
    ctx.restore();

    // Add text
    ctx.fillStyle = "#00ffcc";
    ctx.font = "bold 30px Sans-serif";
    ctx.fillText(`👤 ${targetName}`, 250, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Sans-serif";
    ctx.fillText(`🏅 Level: ${level}`, 250, 110);
    ctx.fillText(`⚡ EXP: ${exp}`, 250, 150);
    ctx.fillText(`💬 Messages: ${msgCount}`, 250, 190);
    ctx.fillText(`💰 Money: $${money}`, 250, 230);

    const imagePath = path.join(__dirname, "cache", `${uid}_rank.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imagePath, buffer);

    message.reply({
      body: `📥 Requested by: ${requesterName}`,
      attachment: fs.createReadStream(imagePath)
    }, () => {
      fs.unlinkSync(imagePath);
      fs.unlinkSync(avatarPath);
    });
  }
};
