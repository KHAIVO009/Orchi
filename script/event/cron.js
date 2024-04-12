const cron = require('node-cron');

module.exports.config = {
  name: "cron",
  version: "69.70",
  credits: "cliff",
  description: "Cron job to send messages"
};

module.exports.handleEvent = async function ({ api }) {
  const interval = 5 * 60 * 1000;
  const minInterval = interval * 60 * 60 * 1000; 
  let lastMessageTime = 0;
  let messagedThreads = new Set();

  cron.schedule(`0 */1 * * *`, async () => {
    const currentTime = Date.now();

    if (currentTime - lastMessageTime < minInterval) {
      console.log("Skipping message due to rate limit");
      return;
    }

    try {
      const data = await api.getThreadList(25, null, ['INBOX']);

      let j = 0;
      for (let i = 0; i < data.length && j < 20; i++) {
        const thread = data[i];
        if (thread.isGroup && thread.name !== thread.threadID && !messagedThreads.has(thread.threadID)) {
          await api.sendMessage({
            body: `⟩𝙏𝙝𝙖𝙣𝙠 𝙮𝙤𝙪 𝙛𝙤𝙧 𝙪𝙨𝙞𝙣𝙜 𝘼𝙪𝙩𝙤𝙗𝙤𝙩!\n\n𝘍𝘰𝘳 𝘺𝘰𝘶𝘳 𝘤𝘰𝘯𝘤𝘦𝘳𝘯𝘴 𝘢𝘣𝘰𝘶𝘵 𝘵𝘩𝘦 𝘚𝘦𝘳𝘷𝘦𝘳 𝘵𝘰𝘰 𝘴𝘭𝘰𝘸, 𝘛𝘩𝘪𝘴 𝘪𝘴 𝘙𝘦𝘧𝘦𝘳𝘳𝘢𝘭 𝘭𝘪𝘯𝘬 𝘩𝘦𝘭𝘱 𝘮𝘦 𝘵𝘰 𝘜𝘱𝘨𝘳𝘢𝘥𝘦 𝘮𝘺 𝘴𝘦𝘳𝘷𝘦𝘳 𝘪 𝘯𝘦𝘦𝘥 𝘮𝘰𝘳𝘦 𝘤𝘰𝘪𝘯𝘴: https://bot-hosting.net/?aff=779952630088204289`
          }, thread.threadID);
          messagedThreads.add(thread.threadID);
          j++;
          setTimeout(() => {
            messagedThreads.delete(thread.threadID);
          }, 1000);
        }
      }

      lastMessageTime = currentTime;
    } catch (error) {
      console.error("Error [Thread List Cron]:", error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
cron.schedule('0 0 0 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Morning everyone!", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 1 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Morning everyone!", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 5 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Morning everyone!", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 6 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Morning everyone! let's eat breakfast", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 7 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Morning everyone!", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 12 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Afternoon everyone! let's eat lunch", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 13 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Afternoon everyone!", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 18 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("Good Evening everyone!", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
cron.schedule('0 0 21 * * *', () => {
	api.getThreadList(30, null, ["INBOX"], (err, list) => {
		if (err) return console.log("ERR: "+err);
		list.forEach(now => (now.isGroup == true && now.threadID != list.threadID) ? api.sendMessage("It's 9:00PM time to sleep Goodnight everyone", now.threadID) : '');
	});
}, {
	scheduled: true,
	timezone: "Asia/Manila"
});
};