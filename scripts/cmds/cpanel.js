const os = require("os");
const moment = require("moment");
const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "cpanel",
    aliases: ["panel", "botstatus"],
    version: "3.0",
    author: "Azad Vai + Fahad",
    role: 0,
    cooldown: 5,
    shortDescription: "Pro Bot Control Panel (GIF)",
    longDescription: "Shows animated system stats in a neon-style dashboard.",
    category: "system",
    guide: {
      en: "{pn}",
      bn: "{pn}"
    }
  },

  onStart: async function ({ message, threadsData, usersData }) {
    try {
      const totalUsers = await usersData.getAll();
      const totalThreads = await threadsData.getAll();
      const uptime = process.uptime();
      const memory = process.memoryUsage();
      const usedMemMB = (memory.rss / 1024 / 1024).toFixed(2);
      const totalMemMB = (os.totalmem() / 1024 / 1024).toFixed(0);
      const prefix = (global.config && global.config.PREFIX) ? global.config.PREFIX : "/";
      const commandsCount = global.client?.commands?.size || 0;
      const formattedTime = moment().format("YYYY-MM-DD HH:mm:ss");

      const formatTime = (sec) => {
        const d = Math.floor(sec / (3600 * 24));
        const h = Math.floor((sec % (3600 * 24)) / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        return `${d}d ${h}h ${m}m ${s}s`;
      };

      const width = 600;
      const height = 300;
      const encoder = new GIFEncoder(width, height);
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      const tempPath = path.join(__dirname, `cpanel_pro_${Date.now()}.gif`);
      const stream = fs.createWriteStream(tempPath);
      encoder.createReadStream().pipe(stream);

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(120);
      encoder.setQuality(10);

      const drawBar = (x, y, w, h, percent, color) => {
        ctx.fillStyle = "#222";
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillRect(x, y, (w * percent), h);
        ctx.shadowBlur = 0;
      };

      const glowText = (text, x, y, size = 20, color = "#0ff") => {
        ctx.font = `${size}px Arial`;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
      };

      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);

        // TITLE
        glowText("⚙️ Messenger GoatBot Panel", 140, 35, 22, "#00ffff");

        // METRICS
        glowText(`🟢 Status: Online`, 40, 75, 18, "#00ff00");
        glowText(`⏱️ Uptime: ${formatTime(uptime + i)}`, 40, 105, 18, "#ffff00");
        glowText(`🔧 Prefix: ${prefix}`, 40, 135, 18, "#ff00ff");
        glowText(`👥 Users: ${totalUsers.length}`, 40, 165, 18, "#00bfff");
        glowText(`💬 Threads: ${totalThreads.length}`, 40, 195, 18, "#ffaa00");
        glowText(`📂 Commands: ${commandsCount}`, 40, 225, 18, "#00ffff");
        glowText(`📅 Time: ${formattedTime}`, 40, 255, 18, "#cccccc");

        // RAM bar
        glowText(`🧠 RAM Usage`, 340, 105, 18, "#ffffff");
        drawBar(340, 115, 220, 12, usedMemMB / totalMemMB, "#ff5555");

        // Uptime bar
        glowText(`🔋 Uptime Load`, 340, 155, 18, "#ffffff");
        drawBar(340, 165, 220, 12, ((uptime + i) % 86400) / 86400, "#00ff99");

        // Footer
        glowText(`Bot Version 3.0`, 420, 280, 16, "#6666ff");

        encoder.addFrame(ctx);
      }

      encoder.finish();

      stream.on("finish", () => {
        message.reply({
          body: "🔧 Bot Control Panel (Pro Edition)",
          attachment: fs.createReadStream(tempPath)
        }, () => fs.unlinkSync(tempPath)); // delete after send
      });

    } catch (err) {
      console.error("❌ Error in cpanel.js:", err);
      message.reply("❌ Failed to generate Pro Panel.");
    }
  }
};
