// mocking the node env is esoteric, see https://stackoverflow.com/a/48042799
const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  // make a copy that we can modify
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

/**
 * Dynamically imports the getAuthSettings for testing.
 * Should be used after setting the desired environment variables
 * for your test, if any.
 */
async function getGetAuthSettings() {
  return (await import("./utils")).getAuthSettings;
}

test("returns nothing when the value is unset", async () => {
  const getAuthSettings = await getGetAuthSettings();
  expect(getAuthSettings()).toBeUndefined();
});

test("returns nothing when the value is unsupported", async () => {
  process.env.REACT_APP_AUTH_ENV = "production";

  const getAuthSettings = await getGetAuthSettings();
  expect(getAuthSettings()).toBeUndefined();
});

test("returns a settings object when the value is supported", async () => {
  process.env.REACT_APP_AUTH_ENV = "development";

  const getAuthSettings = await getGetAuthSettings();

  const settings = getAuthSettings();
  expect(settings).toBeDefined();
  if (typeof settings !== "object") {
    throw new Error("settings must be an object");
  }
  // this test does not need to verify what the specific settings are,
  // just that something of the valid type is provided
  expect(typeof settings.domain).toBe("string");
  expect(typeof settings.clientId).toBe("string");
});
/**
 * Dynamically imports the isAuthEnabled for testing.
 * Should be used after setting the desired environment variables
 * for your test, if any.
 */
async function getIsAuthEnabled() {
  return (await import("./utils")).isAuthEnabled;
}

test("returns false when the value is unset", async () => {
  const isAuthEnabled = await getIsAuthEnabled();
  expect(isAuthEnabled()).toBe(false);
});

test("returns false when the value is not 'true'", async () => {
  process.env.REACT_APP_AUTH_ENABLED = "false";

  const isAuthEnabled = await getIsAuthEnabled();
  expect(isAuthEnabled()).toBe(false);
});

test("returns true when the value is 'true'", async () => {
  process.env.REACT_APP_AUTH_ENABLED = "true";

  const isAuthEnabled = await getIsAuthEnabled();
  expect(isAuthEnabled()).toBe(true);
});

// this doesn't do anything except appease Typescript;
// because there are no top level imports it thinks this is not an "isolated module"
export {};
