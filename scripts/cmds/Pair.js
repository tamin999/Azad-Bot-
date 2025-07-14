const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "pair",
    aliases: ["love", "match"],
    version: "2.2",
    author: "Azad Vai",
    role: 0,
    shortDescription: "Love pair with image",
    longDescription: "Pair two users and show love image",
    category: "fun",
    guide: {
      en: "{pn} [@mention/reply] — generate love pair"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    let uid;
    let userName;

    // Detect target user
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
      userName = event.messageReply.senderName || await usersData.getName(uid);
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
      userName = event.mentions[uid];
    } else {
      uid = event.senderID;
      userName = await usersData.getName(uid);
    }

    // Get all users except this one
    const allUsers = await usersData.getAll();
    const others = allUsers.filter(user => user.userID !== uid);

    if (others.length === 0) return message.reply("❌ No one to pair with!");

    const pair = others[Math.floor(Math.random() * others.length)];
    const pairName = pair.name;
    const pairUID = pair.userID;

    const lovePercent = Math.floor(Math.random() * 51) + 50; // 50–100%

    // Get profile pictures
    const userAvatar = await usersData.getAvatarUrl(uid);
    const pairAvatar = await usersData.getAvatarUrl(pairUID);

    const userAvatarPath = path.join(__dirname, "cache", `${uid}_avatar.png`);
    const pairAvatarPath = path.join(__dirname, "cache", `${pairUID}_avatar.png`);

    const downloadImage = async (url, filepath) => {
      const res = await axios.get(url, { responseType: "stream" });
      const writer = fs.createWriteStream(filepath);
      res.data.pipe(writer);
      return new Promise(resolve => writer.on("finish", resolve));
    };

    await downloadImage(userAvatar, userAvatarPath);
    await downloadImage(pairAvatar, pairAvatarPath);

    // Create canvas
    const canvas = Canvas.createCanvas(700, 400);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const avatar1 = await Canvas.loadImage(userAvatarPath);
    const avatar2 = await Canvas.loadImage(pairAvatarPath);

    // Draw avatars (circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(170, 200, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar1, 70, 100, 200, 200);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(530, 200, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar2, 430, 100, 200, 200);
    ctx.restore();

    // Text
    ctx.fillStyle = "#ff66cc";
    ctx.font = "bold 50px Sans";
    ctx.fillText("💖 LOVE MATCH 💖", 170, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Sans";
    ctx.fillText(`${userName}`, 120, 340);
    ctx.fillText(`${pairName}`, 470, 340);

    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 25px Sans"; // ✅ Smaller love %
    ctx.fillText(`❤️ ${lovePercent}% ❤️`, 290, 200);

    const imgPath = path.join(__dirname, "cache", `${uid}_pair_card.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imgPath, buffer);

    message.reply({
      body: `💞 ${userName} ❤️ ${pairName}\nLove match: ${lovePercent}%`,
      attachment: fs.createReadStream(imgPath)
    }, () => {
      fs.unlinkSync(imgPath);
      fs.unlinkSync(userAvatarPath);
      fs.unlinkSync(pairAvatarPath);
    });
  }
};
