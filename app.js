const axios = require('axios');
const tieron = require('./tierionHelpers');

// starts process
const run = async () => {
  // Generate a new random hash each second.
  const merkleTools = await tieron.addLeafPerSec('arbitrary');
  tieron.sendTreeToChainpoint(merkleTools);
  return run();
};
run();
