// Decides whether a dependency-bump PR from Dependabot, the Claude bot or
// Aikido AutoFix is routine enough for HelperBot to approve.
// dependency-bump-automerge.yml builds the input below from the PR event and
// calls checkPr. checkPr returns null when the PR qualifies, and otherwise a
// reason that starts with a code in brackets, such as
// "[install_script] web/package-lock.json adds a package with an install script".
// Anything unexpected is a reason, so the gate fails closed.
//
// recidiviz-data has a Python copy of this gate. Both copies must pass the
// cases in dependency_bump_gate_cases.json, which is identical in every repo
// that has the gate; change the cases there and in every copy together.
//
// Run the tests with: node --test .github/scripts/
//
// Input (the "input" object of each case in dependency_bump_gate_cases.json):
//   author          PR author login
//   title           PR title
//   labels          label names
//   state, draft    the PR's current state ("open") and draft flag
//   head_sha        the PR's current head commit
//   event_head_sha  the head commit in the event that started the run
//   event           { action, actor } of that event
//   dependencies    Dependabot only: [{ dependencyName, updateType,
//                   packageEcosystem }], as dependabot/fetch-metadata reports
//   files           [{ filename, status, patch, additions, deletions }] from
//                   pulls.listFiles; patch is missing when GitHub omits it
//   commits         [{ sha, author, verified }]: author is the commit author's
//                   login, verified is GitHub's signature check

const MAX_CHANGED_LINES = 400;
const BUMP_LABEL = "Type: Dependency Upgrade";

// PR author login -> source name.
const SOURCES = {
  "dependabot[bot]": "dependabot",
  "claude[bot]": "claude",
  "aikido-autofix[bot]": "aikido",
};
const DEPENDABOT_ECOSYSTEMS = new Set(["npm_and_yarn", "uv", "pip", "docker"]);

const MANIFESTS = new Set([
  "package.json",
  "pyproject.toml",
  "Pipfile",
  "go.mod",
]);
const LOCKFILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "uv.lock",
  "Pipfile.lock",
  "go.sum",
]);
const REGISTRY_HOSTS = new Set([
  "registry.npmjs.org",
  "registry.yarnpkg.com",
  "files.pythonhosted.org",
  "pypi.org",
]);

const baseName = (path) => path.split("/").pop();
const isRequirements = (name) => /^requirements[\w.-]*\.txt$/.test(name);
const isDockerfile = (name) =>
  name === "Dockerfile" ||
  /^Dockerfile\.[\w.-]+$/.test(name) ||
  /\.Dockerfile$/.test(name);
const isPythonManifest = (name) =>
  name === "pyproject.toml" || name === "Pipfile" || isRequirements(name);

// Returns "manifest", "lockfile" or null. Nothing under .github/ qualifies,
// because GitHub Actions bumps and local actions change CI security.
function fileKind(path) {
  if (path.startsWith(".github/")) return null;
  const name = baseName(path);
  if (MANIFESTS.has(name) || isRequirements(name) || isDockerfile(name))
    return "manifest";
  if (LOCKFILES.has(name)) return "lockfile";
  return null;
}

// PEP 503: Python package names compare case-insensitively, and runs of
// "-", "_" and "." are equal. npm, Go and Docker names compare exactly.
const pyName = (name) => name.toLowerCase().replace(/[-_.]+/g, "-");
const stripExtras = (name) => name.replace(/\[[^\]]*\]$/, "");

// Returns { version: [major, minor, patch], suffix } from the first version
// in a spec such as "^1.7.2", ">=2.32.0,<3", "v0.33.0" or "3.12-slim", or
// null.
function versionOf(spec) {
  const m = /(\d+)(?:\.(\d+))?(?:\.(\d+))?(.*)$/.exec(spec);
  return m
    ? {
        version: [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)],
        suffix: m[4],
      }
    : null;
}

// True when to is a higher version than from with the same major version. A
// change of only the image digest ("3.12-slim@sha256:a" to
// "3.12-slim@sha256:b") also counts.
//
// Options:
//   keepMinor: the minor version must not change either. Docker tags use
//     this, because python:3.11-slim to 3.15-slim is a new Python release.
//   zeroMinorIsMajor: on a 0.x version the minor must not change, because
//     a 0.x minor bump may break callers. Claude bumps use this.
//   keepSuffix: the text after the version ("-slim") must not change.
function isSameMajorUpgrade(
  from,
  to,
  { keepMinor = false, zeroMinorIsMajor = false, keepSuffix = false } = {},
) {
  const strip = (s) => s.replace(/@sha256:[0-9a-f]+$/, "");
  if (strip(from) === strip(to)) return from !== to;
  const a = versionOf(strip(from));
  const b = versionOf(strip(to));
  if (!a || !b || a.version[0] !== b.version[0]) return false;
  if (keepSuffix && a.suffix !== b.suffix) return false;
  if (
    (keepMinor || (zeroMinorIsMajor && a.version[0] === 0)) &&
    a.version[1] !== b.version[1]
  )
    return false;
  for (let i = 1; i < 3; i++) {
    if (b.version[i] !== a.version[i]) return b.version[i] > a.version[i];
  }
  return false;
}

// Aikido titles a single-package fix like
// "[Aikido] Fix security issue in pyasn1 via minor version upgrade from 0.6.4 to 0.6.5 in apps",
// sometimes with "Fix 3 security issues in" and sometimes with no " in <dir>".
// Grouped fixes read "Fix 10 security issues in a, b, c" and do not match.
const AIKIDO_TITLE =
  /^\[Aikido\] Fix (?:security issue|\d+ security issues) in (\S+) via (?:patch|minor) version upgrade from v?(\d+)\.\S* to v?(\d+)\.\S*(?: in \S+)?$/;
// Dependabot titles a single bump like "Bump dnspython from 2.9.0 to 2.9.2 in /apps/@reentry/backend".
// In a repo whose history uses conventional commits it adds a prefix and
// lowercases the verb: "build(deps): bump qs from 6.16.0 to 6.17.1 in /app".
// A pip requirement reads "update celery requirement from ~=5.4.0 to ~=5.7.0".
const DEPENDABOT_TITLE =
  /^(?:[\w-]+(?:\([\w-]+\))?!?: )?(?:[Bb]ump (\S+)|[Uu]pdate (\S+) requirement) from (\S+) to (\S+)(?: in \S+)?$/;

const reject = (code, message) => `[${code}] ${message}`;

// Builds the Dependabot dependency list from the PR, in the shape
// dependabot/fetch-metadata reports it. The names and update types come from
// the updated-dependencies block of the commit message, for example:
//   updated-dependencies:
//   - dependency-name: alembic
//     update-type: version-update:semver-minor
// Security updates and indirect dependencies often leave out update-type.
// Then the versions in the title ("Bump requests from 2.31.0 to 2.32.2") or
// the body ("Updates `requests` from 2.31.0 to 2.32.2") set it. The ecosystem
// comes from the branch name, such as dependabot/uv/apps/... Returns null if
// the commit message has no updated-dependencies block.
function parseDependabotDependencies({ title, message, headRef }) {
  const block = /^updated-dependencies:\n([\s\S]*?)^\.\.\.$/m.exec(message);
  if (!block) return null;
  const ecosystem = /^dependabot\/([^/]+)\//.exec(headRef)?.[1] ?? null;
  const dependencies = [];
  for (const entry of block[1].split(/^- /m).slice(1)) {
    // YAML quotes a name that starts with "@", so a scoped npm package reads
    // dependency-name: "@linear/sdk". The quotes are not part of the name.
    const name = /^dependency-name: (\S+)$/m
      .exec(entry)?.[1]
      ?.replace(/^(["'])(.+)\1$/, "$2");
    if (!name) return null;
    const updateType =
      /^\s*update-type: (\S+)$/m.exec(entry)?.[1] ??
      updateTypeFromVersions(title, message, name);
    dependencies.push({
      dependencyName: name,
      updateType,
      packageEcosystem: ecosystem,
    });
  }
  return dependencies.length > 0 ? dependencies : null;
}

// Returns the semver update type of the versions Dependabot gives for name in
// its title and commit message (the largest one if they differ), or null.
function updateTypeFromVersions(title, message, name) {
  const pairs = [];
  const t = DEPENDABOT_TITLE.exec(title);
  if (t && (t[1] ?? t[2]) === name) pairs.push([t[3], t[4]]);
  for (const line of message.split("\n")) {
    const m = /^Updates `([^`]+)` from (\S+) to (\S+)$/.exec(line);
    if (m && m[1] === name) pairs.push([m[2], m[3]]);
  }
  let type = null;
  for (const [from, to] of pairs) {
    const a = versionOf(from);
    const b = versionOf(to);
    if (!a || !b) return null;
    if (a.version[0] !== b.version[0]) return "version-update:semver-major";
    if (a.version[1] !== b.version[1]) type = "version-update:semver-minor";
    else type ??= "version-update:semver-patch";
  }
  return type;
}

// Returns { packages } (an array of names, or null for any name) or { reason }.
function allowedPackages(source, { title, labels, dependencies }) {
  if (source === "aikido") {
    const m = AIKIDO_TITLE.exec(title);
    if (!m) {
      return {
        reason: reject(
          "title",
          "the title is not a single-package patch or minor upgrade",
        ),
      };
    }
    if (m[2] !== m[3]) {
      return {
        reason: reject(
          "not_upgrade",
          `${m[1]} changes major version (${m[2]} to ${m[3]})`,
        ),
      };
    }
    return { packages: [m[1]] };
  }
  if (source === "claude") {
    if (!labels.includes(BUMP_LABEL)) {
      return {
        reason: reject(
          "label",
          `the PR does not have the "${BUMP_LABEL}" label`,
        ),
      };
    }
    return { packages: null };
  }
  // Dependabot
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    return {
      reason: reject("metadata", "there is no Dependabot dependency list"),
    };
  }
  for (const d of dependencies) {
    if (!DEPENDABOT_ECOSYSTEMS.has(d.packageEcosystem)) {
      return {
        reason: reject(
          "ecosystem",
          `${d.dependencyName} is in the ${d.packageEcosystem} ecosystem`,
        ),
      };
    }
    const type = d.updateType || null;
    if (
      type === "version-update:semver-patch" ||
      type === "version-update:semver-minor"
    )
      continue;
    // A Docker digest refresh has no update type; the Dockerfile check decides.
    if (type === null && d.packageEcosystem === "docker") continue;
    return {
      reason: reject(
        "update_type",
        `${d.dependencyName} is not a patch or minor update (${type ?? "no update type"})`,
      ),
    };
  }
  return { packages: dependencies.map((d) => stripExtras(d.dependencyName)) };
}

const NPM_SPEC =
  /^[\^~]?\s*(?:[<>]=?|=)?\s*v?\d+(?:\.(?:\d+|[xX*]))*(?:-[0-9A-Za-z.-]+)?$/;
const PY_CLAUSE = String.raw`(?:===|==|~=|!=|<=|>=|<|>)\s*[\w.*+!-]+`;
const PY_SPECIFIERS = String.raw`${PY_CLAUSE}(?:\s*,\s*${PY_CLAUSE})*`;
const PY_SPEC = new RegExp(
  String.raw`^(?:\*|[\^~]?\s*v?\d[\w.*+!-]*|${PY_SPECIFIERS})$`,
);
// A PEP 508 requirement with a version specifier and an optional
// environment marker, such as: PyJWT[crypto]>=2.15.0; python_version >= "3.9"
const PY_REQUIREMENT = new RegExp(
  String.raw`^([A-Za-z0-9][A-Za-z0-9._-]*)(?:\[[\w\s,.-]*\])?\s*(${PY_SPECIFIERS})\s*(?:;\s*[\w\s.'"<>=!(),~-]+)?$`,
);
const DOCKER_FROM =
  /^FROM\s+(--platform=\S+\s+)?([a-z0-9][a-z0-9._/-]*)(?::([\w.-]+))?(?:@(sha256:[0-9a-f]{64}))?(\s+AS\s+[\w.-]+)?$/i;

// Parses a changed manifest line that sets one package's version. Returns
// { name, spec, stage, platform }, or null for any other line. stage and
// platform are set for a Dockerfile FROM line only. A multi-stage Dockerfile
// can use one image in several stages, so its lines pair up by image and
// stage, and the platform must not change.
function parseVersionLine(fileName, line) {
  if (fileName === "package.json") {
    const m = /^"([^"]+)"\s*:\s*"([^"]*)"\s*,?$/.exec(line);
    return m && NPM_SPEC.test(m[2]) ? { name: m[1], spec: m[2] } : null;
  }
  if (fileName === "go.mod") {
    const m =
      /^(?:require\s+)?(\S+)\s+(v\d[\w.+-]*)(?:\s*\/\/\s*indirect)?$/.exec(
        line,
      );
    return m ? { name: m[1], spec: m[2] } : null;
  }
  if (isDockerfile(fileName)) {
    const m = DOCKER_FROM.exec(line);
    if (!m || (!m[3] && !m[4])) return null;
    return {
      name: m[2],
      spec: `${m[3] ?? ""}${m[4] ? `@${m[4]}` : ""}`,
      platform: (m[1] ?? "").trim(),
      stage: (m[5] ?? "").trim(),
    };
  }
  // Pipfile and pyproject.toml key form: urllib3 = "==2.8.0"
  if (fileName === "Pipfile" || fileName === "pyproject.toml") {
    const m = /^([A-Za-z0-9][A-Za-z0-9._-]*)\s*=\s*"([^"]*)"$/.exec(line);
    if (m) return PY_SPEC.test(m[2]) ? { name: m[1], spec: m[2] } : null;
  }
  // pyproject.toml dependency array item: "PyJWT[crypto]==2.15.0",
  if (fileName === "pyproject.toml") {
    const m = /^(["'])(.*)\1\s*,?$/.exec(line);
    const req = m && PY_REQUIREMENT.exec(m[2]);
    return req ? { name: req[1], spec: req[2] } : null;
  }
  if (isRequirements(fileName)) {
    const req = PY_REQUIREMENT.exec(line.replace(/\s+#.*$/, ""));
    return req ? { name: req[1], spec: req[2] } : null;
  }
  return null;
}

// Yields [sign, text] for each added ("+") or removed ("-") line of a patch.
function* changedLines(patch) {
  for (const raw of patch.split("\n")) {
    const sign = raw[0];
    if (sign !== "+" && sign !== "-") continue;
    yield [sign, raw.slice(1)];
  }
}

// Returns a reason when a manifest's changes are anything other than version
// changes of allowed packages. Each package must have exactly one removed
// and one added line, so no package is added or dropped, and the new version
// must have the same major version and be higher. A Dockerfile tag must also
// keep its minor version and suffix. upgradeOptions go to isSameMajorUpgrade.
// Returns the number of version changes as { bumps } otherwise.
function checkManifest(f, allowed, upgradeOptions = {}) {
  const name = baseName(f.filename);
  const key = isPythonManifest(name) ? pyName : (n) => n;
  const changes = new Map();
  for (const [sign, text] of changedLines(f.patch)) {
    const line = text.trim();
    if (line === "") continue;
    const parsed = parseVersionLine(name, line);
    if (!parsed)
      return {
        reason: reject(
          "manifest_line",
          `${f.filename} changes a line that is not a package version: ${sign}${line}`,
        ),
      };
    if (allowed && !allowed.some((a) => key(a) === key(parsed.name))) {
      return {
        reason: reject(
          "package_not_named",
          `${f.filename} changes ${parsed.name}, which this PR does not name`,
        ),
      };
    }
    const k =
      parsed.stage === undefined
        ? key(parsed.name)
        : `${parsed.name} ${parsed.stage}`.trim();
    const entry = changes.get(k) ?? { removed: [], added: [] };
    (sign === "-" ? entry.removed : entry.added).push(parsed);
    changes.set(k, entry);
  }
  for (const [pkg, { removed, added }] of changes) {
    if (removed.length !== 1 || added.length !== 1) {
      return {
        reason: reject(
          "dependency_added_or_removed",
          `${f.filename} adds or removes ${pkg} instead of changing its version`,
        ),
      };
    }
    const [from, to] = [removed[0], added[0]];
    const options = isDockerfile(name)
      ? { ...upgradeOptions, keepMinor: true, keepSuffix: true }
      : upgradeOptions;
    if (
      from.platform !== to.platform ||
      !isSameMajorUpgrade(from.spec, to.spec, options)
    ) {
      return {
        reason: reject(
          "not_upgrade",
          `${f.filename} changes ${pkg} from ${from.spec} to ${to.spec}, which is not an allowed upgrade`,
        ),
      };
    }
  }
  return { bumps: changes.size };
}

// Sources that point outside the registry: git, GitHub shorthand, local
// paths, and Yarn's link, portal, exec and workspace protocols.
const FORBIDDEN_PROTOCOL =
  /(?:^|[\s"'(=@,{[])(?:git\+[a-z]+:|git:|github:|gitlab:|bitbucket:|gist:|file:|link:|portal:|exec:|workspace:)/i;
const URL_PATTERN = /\b([a-z][a-z0-9+.-]*):\/\/([^/\s"'#?:]+)/gi;
const SOURCE_KEY = /(?:^|[\s"{,])(?:resolved|tarball|url)(?:"?\s*[:=]|\s+")/;

// Returns [code, problem] when an added lockfile line could install code
// from outside the registry or run an install script, or null.
function lockfileLineProblem(fileName, line) {
  if (
    /"hasInstallScript"\s*:\s*true/.test(line) ||
    /\brequiresBuild:\s*true\b/.test(line)
  ) {
    return ["install_script", "adds a package with an install script"];
  }
  if (FORBIDDEN_PROTOCOL.test(line))
    return ["lockfile_source", "adds a source that is not the registry"];
  for (const [, source] of line.matchAll(/\bpatch:[^#\s"]*(#[^\s"]*)?/g)) {
    if (!/^#(?:optional!|~)builtin<compat\/[a-z-]+>/.test(source ?? "")) {
      return [
        "lockfile_source",
        "adds a Yarn patch that is not a builtin compat patch",
      ];
    }
  }
  let sawRegistryUrl = false;
  for (const [, scheme, host] of line.matchAll(URL_PATTERN)) {
    if (
      scheme.toLowerCase() !== "https" ||
      !REGISTRY_HOSTS.has(host.toLowerCase())
    ) {
      return [
        "lockfile_source",
        `adds a URL on ${scheme}://${host}, which is not an allowed registry`,
      ];
    }
    sawRegistryUrl = true;
  }
  if (SOURCE_KEY.test(line) && !sawRegistryUrl)
    return ["lockfile_source", "adds a source with no registry URL"];
  if (fileName === "yarn.lock" && /^(?:__metadata:|cacheKey:)/.test(line)) {
    return ["lockfile_metadata", "changes the Yarn lockfile metadata"];
  }
  if (
    fileName === "uv.lock" &&
    /\bsource\s*=/.test(line) &&
    !/source = \{ registry = "https:\/\/pypi\.org\/simple" \}/.test(line)
  ) {
    return ["lockfile_source", "adds a uv source that is not PyPI"];
  }
  if (
    fileName === "Pipfile.lock" &&
    /"(?:git|path|file|editable|ref|subdirectory)"\s*:/.test(line)
  ) {
    return ["lockfile_source", "adds a Pipenv source that is not PyPI"];
  }
  if (
    fileName === "pnpm-lock.yaml" &&
    /\btype:\s*(?:directory|git)\b/.test(line)
  ) {
    return ["lockfile_source", "adds a pnpm source that is not the registry"];
  }
  return null;
}

// Returns a reason when the changed files are not a routine bump. allowed is
// an array of package names, or null to allow any package whose version
// changes. requireBump means at least one manifest must change a version.
// zeroMinorIsMajor treats a 0.x minor bump as a major one.
function checkFiles(
  files,
  allowed,
  { requireBump = false, zeroMinorIsMajor = false } = {},
) {
  if (files.length === 0) return reject("no_files", "the PR changes no files");
  let changed = 0;
  for (const f of files) {
    if (!fileKind(f.filename))
      return reject(
        "file_type",
        `${f.filename} is not a dependency manifest or lockfile`,
      );
    if (f.status !== "modified")
      return reject(
        "file_status",
        `${f.filename} was ${f.status}, not modified`,
      );
    // GitHub leaves out the patch when a file's diff is too large to show.
    if (typeof f.patch !== "string")
      return reject("no_patch", `GitHub sent no diff for ${f.filename}`);
    changed += f.additions + f.deletions;
  }
  if (changed > MAX_CHANGED_LINES) {
    return reject(
      "too_large",
      `the PR changes ${changed} lines, more than ${MAX_CHANGED_LINES}`,
    );
  }
  let bumps = 0;
  for (const f of files) {
    if (fileKind(f.filename) === "manifest") {
      const result = checkManifest(f, allowed, { zeroMinorIsMajor });
      if (result.reason) return result.reason;
      bumps += result.bumps;
      continue;
    }
    const name = baseName(f.filename);
    for (const [sign, text] of changedLines(f.patch)) {
      if (sign !== "+") continue;
      const problem = lockfileLineProblem(name, text.trim());
      if (problem)
        return reject(
          problem[0],
          `${f.filename} ${problem[1]}: +${text.trim()}`,
        );
    }
  }
  if (requireBump && bumps === 0)
    return reject("no_version_change", "no manifest changes a package version");
  return null;
}

// Returns a reason when the event or the commits do not come from the
// source's bot. Every event must come from the bot itself: a person with
// write access can make a signed commit through the Contents API with the
// bot's email as author, so a later event by that person (a reopen, say)
// must not count. Every commit must be signed (GitHub shows it as verified).
// Dependabot and Aikido commits must also be authored by the bot. The Claude
// bot's commits use an email address that GitHub links to an unrelated user
// account, so for Claude the commit author does not count.
function checkIdentity(source, author, event, commits) {
  const actor = event?.actor;
  if (!actor) return reject("actor", "the event has no actor");
  if (actor !== author) {
    return reject(
      "actor",
      `the ${event.action} event came from ${actor}, not ${author}`,
    );
  }
  if (commits.length === 0) return reject("commit", "the PR has no commits");
  for (const c of commits) {
    if (!c.verified) return reject("commit", `commit ${c.sha} is not signed`);
    if (source !== "claude" && c.author !== author) {
      return reject(
        "commit",
        `commit ${c.sha} is authored by ${c.author}, not ${author}`,
      );
    }
  }
  return null;
}

// Returns null when HelperBot may approve the PR, or the reason it may not.
// input is described at the top of this file.
function checkPr(input) {
  const { author, title, labels, files, commits, dependencies, event } = input;
  const source = SOURCES[author];
  if (!source)
    return reject(
      "author",
      `${author} is not a dependency bot this gate knows`,
    );
  if (input.state !== "open")
    return reject("state", `the PR is ${input.state}`);
  if (input.draft) return reject("draft", "the PR is a draft");
  if (!input.head_sha || input.head_sha !== input.event_head_sha) {
    return reject(
      "head_changed",
      "the PR head is not the commit this event is for",
    );
  }
  const identity = checkIdentity(source, author, event, commits);
  if (identity) return identity;
  const allowed = allowedPackages(source, { title, labels, dependencies });
  if (allowed.reason) return allowed.reason;
  // The Claude bot names no package up front, so its bumps keep the stricter
  // 0.x rule the earlier Claude-only gate used.
  const claude = source === "claude";
  return checkFiles(files, allowed.packages, {
    requireBump: claude,
    zeroMinorIsMajor: claude,
  });
}

module.exports = {
  SOURCES,
  checkPr,
  checkFiles,
  parseDependabotDependencies,
  isSameMajorUpgrade,
  MAX_CHANGED_LINES,
};
