const os = require("os");
const moment = require("moment");

module.exports = {
  config: {
    name: "up",
    aliases: ["uptime", "sys", "status", "system"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Show full system info like a PC"
    },
    longDescription: {
      en: "Displays system uptime, CPU, RAM, platform, ping and status like a PC monitor"
    },
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    const start = Date.now();
    const uptime = moment.utc(process.uptime() * 1000).format("HH:mm:ss");
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    const cpuModel = os.cpus()[0].model;
    const platform = os.platform();
    const arch = os.arch();
    const cores = os.cpus().length;
    const ping = Date.now() - start;

    const reply = `
🖥️ GOAT BOT SYSTEM STATUS 🐐

⏱️ Uptime     : ${uptime}
📶 Ping       : ${ping}ms

⚙️ CPU        : ${cpuModel}
💻 Cores      : ${cores}
📦 Platform   : ${platform}
🧬 Architecture : ${arch}

🧠 RAM Used   : ${usedMem} MB / ${totalMem} MB
📂 RAM Free   : ${freeMem} MB

✅ Bot Status : ONLINE
🔧 Powered By : Azad Vai
    `.trim();

    return message.reply(reply);
  }
};
