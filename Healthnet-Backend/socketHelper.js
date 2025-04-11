let ioInstance;

const setIO = (io) => {
  ioInstance = io;
};

const notifyQueueStatus = (queue) => {
  console.log('Notify function called:', queue);
  if (ioInstance) {
    ioInstance.emit('queueUpdate', queue);
  } else {
    console.log('Socket IO instance is not set.');
  }
};

module.exports = { setIO, notifyQueueStatus };
