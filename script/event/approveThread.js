module.exports.config = {
  name: "approveThread",
  version: "69.70",
  credits: "cliff",
  description: "Approve group threads automatically"
};

module.exports.handleEvent = async ({ api }) => {
  const configCustom = {
    acceptPending: {
      status: true,
      time: 2, // 2 minutes
      note: 'Approve waiting messages after a certain time. Set the status to false to disable auto-accept message requests.'
    }
  };

  function acceptPending(config) {
    if (config.status) {
      setInterval(async () => {
        const list = [
          ...(await api.getThreadList(30, null, ['PENDING'])),
          ...(await api.getThreadList(30, null, ['OTHER']))
        ];
        if (list[0]) {
          api.sendMessage('[☘️]This thread/user is automatically approved by our system\n\ndon`t try to spam my bot to avoid being blocked\nenjoy using my bot♥️', list[0].threadID);
          clearInterval(interval);
        }
      }, config.time * 60 * 1000);
    }
  }
 acceptPending(configCustom.acceptPending);
};
