module.exports = async () => {
  // kill the test server we spawned during global setup
  global.TEST_SERVER.kill();
};
