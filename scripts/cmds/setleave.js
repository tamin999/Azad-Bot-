const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");
const { getStreamFromPath } = global.utils;

module.exports = {
  config: {
    name: "goodbye",
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send custom goodbye card" },
    longDescription: {
      en: "Sends a goodbye image with user's profile photo, name, and group name when they leave the group.",
    },
    category: "group",
  },

  onEvent: async function ({ event, message, threadsData }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    const userID = event.logMessageData.leftParticipantFbId;
    const userName = event.logMessageData.leftParticipantFullName;
    const threadID = event.threadID;
    const threadName = (await threadsData.get(threadID))?.threadName || "this group";

    try {
      // Load profile picture
      const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512`;
      const avatar = await Canvas.loadImage(avatarURL);

      // Background image (you can change this URL)
      const bg = await Canvas.loadImage("https://i.imgur.com/zv2h3gB.jpg");

      // Create canvas
      const canvas = Canvas.createCanvas(800, 400);
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(bg, 0, 0, 800, 400);

      // Circle mask for avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(180, 200, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 80, 100, 200, 200);
      ctx.restore();

      // Draw texts
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px Arial";
      ctx.fillText("Goodbye,", 320, 180);
      ctx.fillStyle = "#ffcc00";
      ctx.fillText(userName, 320, 240);
      ctx.fillStyle = "#cccccc";
      ctx.font = "30px Arial";
      ctx.fillText(`from ${threadName}`, 320, 290);

      // Save and send image
      const filePath = path.join(__dirname, "temp", `goodbye_${userID}.png`);
      fs.ensureDirSync(path.dirname(filePath));
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      await message.send({
        body: `👋 ${userName} has left ${threadName}.`,
        attachment: await getStreamFromPath(filePath),
      });

      // Cleanup
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("❌ Goodbye image error:", err);
    }
  },
};
