const axios = require("axios");

module.exports = {
  config: {
    name: "tiktokid",
    aliases: ["ttid", "tikid"],
    version: "1.0",
    author: "Azad Vai",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Get TikTok user info by username" },
    longDescription: {
      en: "Returns TikTok user's profile information including name, bio, stats, and profile photo.",
    },
    category: "info",
    guide: {
      en: "{pn} <username>\nExample: {pn} charlidamelio",
    },
  },

  onStart: async function ({ message, args }) {
    const username = args[0];
    if (!username) {
      return message.reply("❌ Please provide a TikTok username.\nExample: tiktokid charlidamelio");
    }

    try {
      const response = await axios.get(`https://api.tikwm.com/user/info?unique_id=${username}`);
      const user = response.data?.data;

      if (!user) {
        return message.reply("❌ User not found or TikTok API error.");
      }

      const caption = `👤 Name: ${user.nickname}
🆔 Username: @${user.unique_id}
📍 Region: ${user.region}
💬 Bio: ${user.signature || "No bio"}
🎥 Total Videos: ${user.aweme_count}
👥 Followers: ${user.follower_count}
👣 Following: ${user.following_count}
❤️ Likes: ${user.total_favorited}`;

      const imageUrl = user.avatar_larger;

      return message.send({
        body: caption,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error fetching TikTok user info. Please try again.");
    }
  }
};
