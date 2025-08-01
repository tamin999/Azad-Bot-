const fs = require("fs");
const request = require("request");


function convert(time) {
	const date = new Date(time);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const formattedDate = `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}||${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
	return formattedDate;
}

const headers = {
	"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like) Version/12.0 eWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
	"accept": "application/json, text/plain, /"
};

module.exports = {
	config: {
		name: "fbstalk",
		aliases: ["fbstalk"],
		version: "1.0",
		author: "Deku X kshitiz",
		countDown: 5,
		role: 0,
		shortDescription: "Get info using uid/mention/reply to a message",
		longDescription: {
			en: "Get info using uid/mention/reply to a message",
		},
		category: "𝗜𝗡𝗙𝗢",
		guide: {
			en: "{pn}reply/uid/@mention",
		},
	},

	onStart: async function ({ api, event, args }) {
		let path = __dirname + `/cache/info.png`;
		const token = "EAAGNO4a7r2wBO8ZAtzV0tSWkb8TX8YTnX2yW9vqi7NZAOkb58OzSYLZCOnEdebxIGuZBQrjFk6NqoLgcFUk0KPnatBY1gZBo2NGnNK3Y4MbIJlmYT6dyylzvZCxkZCZBERwxEclUyRIE07fJHwnHJmhZCbNC1f8nuboFt8vQpIOdb7fORwogidPT3uZB41MgZDZD"; // Replace with your Facebook access token

		let id;
		if (args.join().includes('@')) {
			id = Object.keys(event.mentions)[0];
		} else {
			id = args[0] || event.senderID;
		}

		if (event.type === "message_reply") {
			id = event.messageReply.senderID;
		}

		try {
			const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,is_verified,cover,created_time,work,hometown,username,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`, { headers });

			const name = resp.data.name;
			const link_profile = resp.data.link;
			const uid = resp.data.id;
			const first_name = resp.data.first_name;
			const username = resp.data.username || "No data!";
			const created_time = convert(resp.data.created_time);
			const web = resp.data.website || "No data!";
			const gender = resp.data.gender;
			const relationship_status = resp.data.relationship_status || "No data!";
			const love = resp.data.significant_other || "No data!";
			const bday = resp.data.birthday || "No data!";
			const follower = resp.data.subscribers.summary.total_count || "No data!";
			const is_verified = resp.data.is_verified;
			const quotes = resp.data.quotes || "No data!";
			const about = resp.data.about || "No data!";
			const locale = resp.data.locale || "No data!";
			const hometown = !!resp.data.hometown ? resp.data.hometown.name : "No Hometown";
			const cover = resp.data.cover || "No Cover photo";
			const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=61557361836577|0722a7d5b5a4ac06b11450f7114eb2e9`;


			const cb = function () {
				api.sendMessage({
					body: `•——INFORMATION——•
		Name: ${"Yoʋʀ ʌzʌɗ"}
		First name: ${"🅰🆉🅰🅳"}
		Creation Date: ${" 🙂🙏"}
		Profile link: ${"https://www.facebook.com/fa.fahad.842569"}
		Gender: ${"male"}
		Relationship Status: ${"single"}
		Birthday: ${"🦆💨"}
		Follower(s): ${"1500"}
		Hometown: ${"Chittagong"}
		Locale: ${"☢️"}
		•——END——•`,
					attachment: fs.createReadStream(path)
				}, event.threadID, () => fs.unlinkSync(path), event.messageID);
			};
			request(encodeURI(avatar)).pipe(fs.createWriteStream(path)).on("close", cb);
		} catch (err) {
			api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
		}
	}
};
