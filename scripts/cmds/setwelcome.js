const fs = require("fs-extra");

module.exports = {
  config: {
    name: "welcome",
    eventType: ["log:subscribe"],
    version: "2.0",
    author: "Azad Vai",
    description: "Send welcome message when someone joins group"
  },

  onStart: async function ({ threadsData, event, message, usersData }) {
    const { threadID } = event;

    // Check welcome toggle
    const thread = await threadsData.get(threadID);
    const { data, settings } = thread;
    if (settings?.sendWelcomeMessage !== true) return;

    // Get group name and members
    const groupName = thread.threadInfo?.threadName || "this group";
    const members = event.logMessageData.addedParticipants;
    const mentions = [];
    let names = [];

    for (const member of members) {
      const uid = member.userFbId || member.userId;
      const name = (await usersData.get(uid))?.name || member.fullName;
      mentions.push({ id: uid, tag: name });
      names.push(name);
    }

    const session = getSession();
    const userName = names.join(", ");
    const userNameTag = mentions.map(m => m.tag).join(", ");
    const multiple = names.length > 1 ? "you all" : "you";
    const totalMembers = thread.members.length;

    let content = data.welcomeMessage || `🎉 Hello {userName}, welcome to {boxName}! You are member #{memLength}. Have a great {session}!`;

    content = content
      .replace(/{userName}/g, userName)
      .replace(/{userNameTag}/g, userNameTag)
      .replace(/{boxName}/g, groupName)
      .replace(/{multiple}/g, multiple)
      .replace(/{session}/g, session)
      .replace(/{memLength}/g, totalMembers);

    // Load attachments if any
    let attachment = [];
    if (data.welcomeAttachment?.length) {
      try {
        const files = await Promise.all(
          data.welcomeAttachment.map(id => global.utils.drive.getFile(id))
        );
        attachment = files.filter(Boolean).map(f => fs.createReadStream(f.path));
      } catch (e) {
        console.error("Error loading welcome files:", e);
      }
    }

    message.send({ body: content, mentions, attachment });
  }
};

// Session helper
function getSession() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
  }
