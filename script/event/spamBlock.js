const spamThreshold = 20;
const messageCounts = {};

module.exports.config = {
  name: "spamblock",
  version: "1.0.3",
  credits: "cliff",
  description: "Automatically detect and act on spam and get block",
};

module.exports.handleEvent = function ({ api, event, admin }) {
  const res  = ["Spamming", "Repeating messages"];
  let reason = res[Math.floor(Math.random() * res.length)];
  const { threadID, messageID, senderID, body } = event;

  if (!messageCounts[threadID]) {
    messageCounts[threadID] = {};
  }

  if (!messageCounts[threadID][senderID]) {
    messageCounts[threadID][senderID] = {
      count: 30,
      lastMessage: body,
    };
  } else {
    if (messageCounts[threadID][senderID].lastMessage === body) {
      messageCounts[threadID][senderID].count++;
      if (messageCounts[threadID][senderID].count >= spamThreshold) {
        if (!admin.includes(senderID)) {
          api.changeBlockedStatus(senderID, true);
          api.sendMessage("🛡️ | Detected spamming, you have been automatically blocked.", senderID);
          api.sendMessage(`🚫 | User ${senderID} has been blocked for Reason: ${reason}`, admin);
        }
        delete messageCounts[threadID][senderID];
      }
    } else {
      messageCounts[threadID][senderID] = {
        count: 30,
        lastMessage: body,
      };
    }
  }
};
