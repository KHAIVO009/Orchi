module.exports.config = {
  name: "edit",
  version: "1.0",
  role: 0,
 hasPrefix: false,
  credits: 'Yan Maglinte',
  description: `Edit Bot's messages!`,
  usage: 'reply to a message then type edit <your_message>',
  cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
  let reply, edit;

  if (event.type === "message_reply") {
    reply = event.messageReply.body;
    edit = args.join(" ");
  } else {
    api.sendMessage("Invalid input. Please reply to a bot message to edit.", event.threadID, event.messageID);
    return;
  }

  if (!reply || args.length === 0) {
    api.sendMessage("Invalid input. Please reply to a bot message to edit.", event.threadID, event.messageID);
    return;
  }

  try {
    await api.editMessage(edit, event.messageReply.messageID);
    api.setMessageReaction('✅', event.messageID, () => {}, true);
  } catch (error) {
    console.error("Error editing message", error);
    api.sendMessage("An error occurred while editing the message. Please try again later.", event.threadID);
  }
};