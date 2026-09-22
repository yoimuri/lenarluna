// Deletes old Vercel deployments, keeping only the newest few.
//
// WHY: every deployment counts against Deployment Storage until it is
// deleted. Vercel does expire them on its own (Hobby defaults to 30-day
// retention, always keeping the last 3), but its background job can take up
// to 48 hours after a deployment becomes eligible. This deletes on demand. Lenar edits through GitHub's web UI, which commits one
// file at a time -- so a single afternoon of uploading can be 40+ deployments.
// At that rate the free 10 GB is gone in about a month no matter how small
// each build is. Keeping a handful and deleting the rest holds storage flat.
//
// USAGE -- works the same in PowerShell, Git Bash and cmd:
//
//   node scripts/prune-deployments.mjs --token=XXX --project=YYY
//       ^ dry run. Lists what it WOULD delete. Deletes nothing.
//
//   node scripts/prune-deployments.mjs --token=XXX --project=YYY --yes
//       ^ actually deletes.
//
//   Optional: --team=team_xxx   (only if the project is under a team)
//             --keep=3          (how many recent deployments to keep)
//
// The values can also come from environment variables instead
// (VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID, KEEP) -- that is how the
// GitHub Action passes them. Flags win if both are set.
//
// SAFETY
//   - Never deletes the current production deployment.
//   - Never deletes anything still BUILDING or QUEUED (that would kill a
//     deploy in flight).
//   - Dry run unless --yes is passed.

// --name=value from the command line, falling back to an env var.
function arg(name, envName, fallback = "") {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  return process.env[envName] || fallback;
}

const TOKEN = arg("token", "VERCEL_TOKEN");
const PROJECT = arg("project", "VERCEL_PROJECT_ID");
const TEAM = arg("team", "VERCEL_TEAM_ID");
const KEEP = Math.max(1, parseInt(arg("keep", "KEEP", "3"), 10) || 3);
const APPLY = process.argv.includes("--yes");

if (!TOKEN || !PROJECT) {
  console.error(`
Missing the token or the project ID.

Run it like this (one line, works in any terminal):

  node scripts/prune-deployments.mjs --token=YOUR_TOKEN --project=YOUR_PROJECT_ID

  token       vercel.com/account/tokens  ->  Create Token
  project     Vercel -> your project -> Settings -> General -> Project ID

That is a DRY RUN: it only lists what it would delete. Add --yes at the end
when you want it to actually delete them.
`);
  process.exit(1);
}

const teamParam = TEAM ? `&teamId=${encodeURIComponent(TEAM)}` : "";
const headers = { Authorization: `Bearer ${TOKEN}` };

async function api(url, init) {
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${init?.method || "GET"} ${url.split("?")[0]} -> ${res.status} ${await res.text()}`);
  return res.json();
}

// Newest first. Paginate with the `until` cursor so we see ALL of them,
// not just the first page -- there can be hundreds.
async function listAll() {
  const out = [];
  let until;
  for (let page = 0; page < 40; page++) {
    const u = `https://api.vercel.com/v6/deployments?projectId=${encodeURIComponent(PROJECT)}&limit=100${teamParam}${until ? `&until=${until}` : ""}`;
    const { deployments = [], pagination } = await api(u);
    out.push(...deployments);
    if (!pagination?.next || deployments.length === 0) break;
    until = pagination.next;
  }
  return out;
}

let all;
try {
  all = await listAll();
} catch (err) {
  const msg = err.message || "";
  if (msg.includes("403") || msg.includes("401") || msg.includes("invalidToken")) {
    console.error(`
The token was rejected by Vercel.

  - Check it was copied whole, with no spaces at either end.
  - Tokens can expire. Make a fresh one at vercel.com/account/tokens.
  - If the project sits under a TEAM rather than your personal account, the
    token needs that team's scope, and you also need --team=team_xxxxx
    (Vercel -> Team Settings -> General).
`);
  } else if (msg.includes("404")) {
    console.error(`
Vercel could not find that project.

  --project should be the Project ID from
  Vercel -> your project -> Settings -> General. It looks like prj_xxxxxxxx.
  The project's NAME usually works too, but the ID is the safe one.
`);
  } else {
    console.error(`
Could not reach Vercel: ${msg}
`);
  }
  process.exit(1);
}
all.sort((a, b) => (b.created || b.createdAt || 0) - (a.created || a.createdAt || 0));

const IN_FLIGHT = new Set(["BUILDING", "QUEUED", "INITIALIZING"]);
const protectedIds = new Set();

// Whatever is currently serving production stays, wherever it sits in the list.
const live = all.find((d) => d.target === "production" && d.state === "READY");
if (live) protectedIds.add(live.uid);
// ...and so do the newest KEEP deployments, plus anything mid-build.
all.slice(0, KEEP).forEach((d) => protectedIds.add(d.uid));
all.filter((d) => IN_FLIGHT.has(d.state)).forEach((d) => protectedIds.add(d.uid));

const doomed = all.filter((d) => !protectedIds.has(d.uid));

console.log(`Found ${all.length} deployment(s). Keeping ${all.length - doomed.length}, deleting ${doomed.length}.`);
if (live) console.log(`Live production deployment (protected): ${live.url}`);

if (doomed.length === 0) {
  console.log("Nothing to do.");
} else if (!APPLY) {
  console.log("\nDRY RUN -- nothing deleted. These would go:\n");
  doomed.slice(0, 15).forEach((d) => console.log(`  ${d.uid}  ${d.state.padEnd(9)} ${d.url}`));
  if (doomed.length > 15) console.log(`  ...and ${doomed.length - 15} more`);
  console.log("\nRe-run with --yes to actually delete them.");
} else {
  let ok = 0, failed = 0;
  for (const d of doomed) {
    try {
      await api(`https://api.vercel.com/v13/deployments/${d.uid}?${teamParam.slice(1)}`, { method: "DELETE" });
      ok++;
      if (ok % 10 === 0) console.log(`  deleted ${ok}/${doomed.length}...`);
    } catch (err) {
      failed++;
      console.warn(`  could not delete ${d.uid}: ${err.message.slice(0, 120)}`);
    }
  }
  console.log(`\nDeleted ${ok}. Failed ${failed}. Kept ${all.length - ok}.`);
}
