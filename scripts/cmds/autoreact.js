module.exports = {
    config: {
        name: "autoreact",
		      version: "1.0",
	       	author: "BaYjid",
		      countDown: 5,
	       	role: 0,
		      shortDescription: "",
	       	longDescription: "",
		       category: "dont know ",
    },
	onStart: async function (){},
	onChat: async function ({ event ,api}) {
		if (event.body.toLowerCase().indexOf("iloveyou") !== -1) return api.setMessageReaction("😞", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("good night") !== -1) return api.setMessageReaction("🌃", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("good morning") !== -1) return api.setMessageReaction("🌇", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("bby") !== -1) return api.setMessageReaction("🩷", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("jan") !== -1) return api.setMessageReaction("🪽", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("mwa") !== -1) return api.setMessageReaction("💗", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("😢") !== -1) return api.setMessageReaction("👀", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("😆") !== -1) return api.setMessageReaction("😃", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("😂") !== -1) return api.setMessageReaction("😑", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("🤣") !== -1) return api.setMessageReaction("😾", event.messageID,event.threadID)
    
   	if (event.body.toLowerCase().indexOf("tangina") !== -1) return api.setMessageReaction("😡", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("good afternoon") !== -1) return api.setMessageReaction("⛅", event.messageID,event.threadID)

		if (event.body.toLowerCase().indexOf("good evening") !== -1) return api.setMessageReaction("🌘", event.messageID,event.threadID)

		if (event.body.toLowerCase().indexOf("everyone") !== -1) return api.setMessageReaction("🙄", event.messageID,event.threadID)

    		if (event.body.toLowerCase().indexOf("bastob") !== -1) return api.setMessageReaction("😳", event.messageID,event.threadID)

        		if (event.body.toLowerCase().indexOf("kire") !== -1) return api.setMessageReaction("😳", event.messageID,event.threadID)

        		if (event.body.toLowerCase().indexOf("xuna") !== -1) return api.setMessageReaction("😛", event.messageID,event.threadID)

        		if (event.body.toLowerCase().indexOf("hi") !== -1) return api.setMessageReaction("🥸", event.messageID,event.threadID)

        		if (event.body.toLowerCase().indexOf("hello") !== -1) return api.setMessageReaction("😺", event.messageID,event.threadID)

        		if (event.body.toLowerCase().indexOf("zope") !== -1) return api.setMessageReaction("⏳", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("pangit") !== -1) return api.setMessageReaction("😠", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("redroom") !== -1) return api.setMessageReaction("😏", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("😏") !== -1) return api.setMessageReaction("😼", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("pakyu") !== -1) return api.setMessageReaction("🤬", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("fuck you") !== -1) return api.setMessageReaction("👺", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("bata") !== -1) return api.setMessageReaction("👧", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("kid") !== -1) return api.setMessageReaction("👧", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("i hate you") !== -1) return api.setMessageReaction("😞", event.messageID,event.threadID)
  
    if (event.body.toLowerCase().indexOf("useless") !== -1) return api.setMessageReaction("😓", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("omg") !== -1) return api.setMessageReaction("🧐", event.messageID,event.threadID)

if (event.body.toLowerCase().indexOf("shoti") !== -1) return api.setMessageReaction("😏", event.messageID,event.threadID)

if (event.body.toLowerCase().indexOf("pogi") !== -1) return api.setMessageReaction("😎", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("ganda") !== -1) return api.setMessageReaction("🪽", event.messageID,event.threadID)

if (event.body.toLowerCase().indexOf("i miss you") !== -1) return api.setMessageReaction("🖤", event.messageID,event.threadID)

if (event.body.toLowerCase().indexOf("sad") !== -1) return api.setMessageReaction("😔", event.messageID,event.threadID)
    
  }
};
