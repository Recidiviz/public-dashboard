/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require("path");
const { spawn } = require("child_process");

module.exports = async () => {
  // start the API test server. save reference so we can kill it in teardown
  global.TEST_SERVER = spawn("yarn", ["start-test-server"], {
    cwd: resolve(__dirname, "../spotlight-api"),
  });

  // set the timezone for all tests to UTC for consistency across environments
  process.env.TZ = "UTC";
};
