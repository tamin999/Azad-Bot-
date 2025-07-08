const axios = require("axios");
const fs = require('fs');

const baseApiUrl = async () => {
	const base = await axios.get(
`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
	);
	return base.data.api;
};

module.exports = {
	config: {
		name: "ytb",
		version: "1.1.4",
		aliases: ['youtube'],
		author: "dipto",
		countDown: 5,
		role: 0,
		description: {
			en: "Download video, audio, and info from YouTube"
		},
		category: "media",
		guide: {
			en: "  {pn} [video|-v] [<video name>|<video link>]: use to download video from YouTube."
				+ "\n   {pn} [audio|-a] [<video name>|<video link>]: use to download audio from YouTube"
				+ "\n   {pn} [info|-i] [<video name>|<video link>]: use to view video information from YouTube"
				+ "\n   Example:"
				+ "\n {pn} -v chipi chipi chapa chapa"
				+ "\n {pn} -a chipi chipi chapa chapa"
				+ "\n {pn} -i chipi chipi chapa chapa"
		}
	},
	onStart: async ({ api, args, event, commandName }) => {
		const action = args[0].toLowerCase();
		
					const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const urlYtb = checkurl.test(args[1]);
		let videoID
  if(urlYtb){
		if (action === '-v' || action === '-a') {
			try {
				const format = action === '-v' ? 'mp4' : 'mp3';
				const path = `ytb_${format}_${videoID}.${format}`;
	  
	const match = args[1].match(checkurl);
  videoID = match ? match[1] : null;
				const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}&quality=3`);
await api.sendMessage({
					body: `â€¢ Title: ${title}\nâ€¢ Quality: ${quality}`,
					attachment: await dipto(downloadLink, path)
				}, event.threadID, () => fs.unlinkSync(path), event.messageID);
			} catch (e) {
				console.error(e);
				return api.sendMessage('âŒ Failed to download the video/audio. Please try again later.', event.threadID, event.messageID);
			}
		} }
		args.shift();
		let keyWord = args.join(" ");
		const maxResults = 6;
		let result;
		try {
			result = (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${keyWord}`)).data.slice(0, maxResults);
		} catch (err) {
			return api.sendMessage("âŒ An error occurred: " + err.message, event.threadID, event.messageID);
		}

		if (result.length === 0) {
			return api.sendMessage("â­• No search results match the keyword: " + keyWord, event.threadID, event.messageID);
		}

		let msg = "";
		let i = 1;
		const thumbnails = [];
		for (const info of result) {
			thumbnails.push(diptoSt(info.thumbnail, `thumbnail.jpg`));
			msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
		}

		api.sendMessage({
			body: msg + "Reply to this message with a number to choose",
			attachment: await Promise.all(thumbnails)
		}, event.threadID, (err, info) => {		global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				author: event.senderID,
				result,
				action
			});
		}, event.messageID);
	},

	onReply: async ({ event, api, Reply }) => {
		const { result, action } = Reply;
		const choice = parseInt(event.body);

		if (isNaN(choice) || choice <= 0 || choice > result.length) {
			return api.sendMessage('âŒ Invalid choice. Please reply with a valid number.', event.threadID, event.messageID);
		}

		const selectedVideo = result[choice - 1];
		const videoID = selectedVideo.id;

		if (action === '-v' || action === 'video' || action === 'mp4' || action === '-a'  || action === 'audio' || action === 'mp3' || action === 'music') {
			try {
				let format = ['-a', 'audio', 'mp3', 'music'].includes(action) ? 'mp3' : 'mp4';
				const path = `ytb_${format}_${videoID}.${format}`;
				const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}&quality=3`);

				api.unsendMessage(Reply.messageID);
				await api.sendMessage({
					body: `â€¢ Title: ${title}\nâ€¢ Quality: ${quality}`,
					attachment: await dipto(downloadLink, path)
				}, event.threadID, () => fs.unlinkSync(path), event.messageID);
			} catch (e) {
				console.error(e);
				return api.sendMessage('âŒ Failed to download the video/audio. Please try again later.', event.threadID, event.messageID);
			}
		}

	if (action === '-i' || action === 'info') {
			try {
				const { data } = await axios.get(`${await baseApiUrl()}/ytfullinfo?videoID=${videoID}`);
				api.unsendMessage(Reply.messageID);
				await api.sendMessage({
					body: `âœ¨ | ðšƒðš’ðšðš•ðšŽ: ${data.title}\nâ³ | ð™³ðšžðš›ðšŠðšðš’ðš˜ðš—: ${data.duration / 60} minutes\nðšðšŽðšœðš˜ðš•ðšžðšðš’ðš˜ðš—: ${data.resolution}\nðŸ‘€ | ðš…ðš’ðšŽðš  ð™²ðš˜ðšžðš—ðš: ${data.view_count}\nðŸ‘ðŸ» | ð™»ðš’ðš”ðšŽðšœ: ${data.like_count}\nðŸ“¬ | ð™²ðš˜ðš–ðš–ðšŽðš—ðšðšœ: ${data.comment_count}\nâ™»ï¸ | ð™²ðšŠðšðšŽðšðš˜ðš›ðš’ðšŽðšœ: ${data.categories[0]}\nðŸŒ | ð™²ðš‘ðšŠðš—ðš—ðšŽðš•: ${data.channel}\nðŸ§ðŸ»â€â™‚ï¸ | ðš„ðš™ðš•ðš˜ðšŠðšðšŽðš› ð™¸ðš: ${data.uploader_id}\nðŸ‘¥ | ðš‚ðšžðš‹ðšœðšŒðš›ðš’ðš‹ðšŽðš›ðšœ: ${data.channel_follower_count}\nðŸ”— | ð™²ðš‘ðšŠðš—ðš—ðšŽðš• ðš„ðš›ðš•: ${data.channel_url}\nðŸ”— | ðš…ðš’ðšðšŽðš˜ ðš„ðš›ðš•: ${data.webpage_url}`,
					attachment: await diptoSt(data.thumbnail, 'info_thumb.jpg')
				}, event.threadID, event.messageID);
			} catch (e) {
				console.error(e);
				return api.sendMessage('âŒ Failed to retrieve video info. Please try again later.', event.threadID, event.messageID);
			}
		}
	}
};
async function dipto(url,pathName) {
	try {
		const response = (await axios.get(url,{
			responseType: "arraybuffer"
		})).data;

		fs.writeFileSync(pathName, Buffer.from(response));
		return fs.createReadStream(pathName);
	}
	catch (err) {
		throw err;
	}
}
async function diptoSt(url,pathName) {
	try {
		const response = await axios.get(url,{
			responseType: "stream"
		});
		response.data.path = pathName;
		return response.data;
	}
	catch (err) {
		throw err;
	}
  }
