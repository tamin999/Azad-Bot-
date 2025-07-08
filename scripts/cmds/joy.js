module.exports = {
 config: {
	 name: "joy",
	 version: "1.0",
	 author: "AceGun",
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "no prefix",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "joy") {
 return message.reply({
 body: " 「  HI JOY 🙈🙏 \n\n𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥\n🅰🆉🅰🅳」",
 attachment: await global.utils.getStreamFromURL("https://i.imgur.com/InHAV2o.mp4")
 });
 }
 }
}
