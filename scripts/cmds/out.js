const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
	config: {
		name: "Out",
		aliases: ["l"],
		version: "1.0",
		author: "Sandy",
		countDown: 5,
		role: 2,
		shortDescription: "bot will leave gc",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('🎀𝗔𝘇𝗮𝗱 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁 𝐋𝐄𝐅𝐓 𝐆𝐑𝐎𝐔𝐏🎀', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};
