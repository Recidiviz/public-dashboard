import type { JSDOM } from "jsdom";

// this comes from the jest-environment-jsdom-global package;
// only present in the test environment
declare global {
  const jsdom: JSDOM;
}
