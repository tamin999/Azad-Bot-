const { loadImage, createCanvas, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

// Font Registration
registerFont(path.join(__dirname, "fonts", "Montserrat-Bold.ttf"), {
  family: "Montserrat",
});

module.exports = {
  config: {
    name: "rank",
    aliases: ["profile", "level"],
    version: "1.0",
    author: "Azad Vai",
    role: 0,
    shortDescription: { en: "Display user profile" },
    longDescription: { en: "Show user's level, EXP, money, and stats in image format." },
    category: "info",
    guide: { en: "{p}rank" }
  },

  onStart: async function ({ api, event, message, usersData }) {
    const userID = event.senderID;
    const userData = await usersData.get(userID);

    const name = userData.name || "Unknown";
    const gender = userData.gender === "MALE" ? "Male" : "Female";
    const money = userData.money || 0;
    const exp = userData.exp || 0;
    const level = userData.level || 1;
    const username = userData.username || `user${userID.slice(-4)}`;
    const messageCount = userData.messageCount || 0;

    // Simulated Rankings (Replace with real logic if needed)
    const expRank = "470/14807";
    const moneyRank = "2125/14807";

    const canvas = createCanvas(1000, 500);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#080014";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#c900ff";
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 980, 480);

    // Avatar
    const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512`;
    const avatar = await loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 130, 90, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 60, 40, 180, 180);
    ctx.restore();

    // Name & Info
    ctx.fillStyle = "#ffffff";
    ctx.font = "38px Montserrat";
    ctx.fillText(name, 270, 90);

    ctx.font = "22px Montserrat";
    ctx.fillStyle = "#b07fff";
    ctx.fillText(`User ID: ${userID}`, 270, 130);
    ctx.fillText(`Nickname: ${name}`, 270, 165);
    ctx.fillText(`Gender: ${gender}`, 270, 200);
    ctx.fillText(`Username: ${username}`, 270, 235);
    ctx.fillText(`Level: ${level}`, 270, 270);

    ctx.fillText(`EXP: ${exp}`, 620, 130);
    ctx.fillText(`Money: ${money}`, 620, 165);
    ctx.fillText(`Messages: ${messageCount}`, 620, 200);
    ctx.fillText(`EXP Rank: ${expRank}`, 620, 235);
    ctx.fillText(`Money Rank: ${moneyRank}`, 620, 270);

    // Footer
    ctx.fillStyle = "#aaa";
    ctx.font = "16px Montserrat";
    const dateTime = new Date().toISOString().replace("T", " ").split(".")[0];
    ctx.fillText(`Last Update: ${dateTime}`, 360, 470);

    const imgBuffer = canvas.toBuffer("image/png");
    const filePath = path.join(__dirname, "temp", `${userID}_rank.png`);
    fs.ensureDirSync(path.join(__dirname, "temp"));
    fs.writeFileSync(filePath, imgBuffer);

    await message.reply({
      body: "",
      attachment: fs.createReadStream(filePath)
    });

    fs.unlinkSync(filePath);
  }
};
