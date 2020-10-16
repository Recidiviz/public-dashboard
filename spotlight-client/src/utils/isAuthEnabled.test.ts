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
 * Dynamically imports the isAuthEnabled for testing.
 * Should be used after setting the desired environment variables
 * for your test, if any.
 */
async function getIsAuthEnabled() {
  return (await import("./isAuthEnabled")).default;
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
