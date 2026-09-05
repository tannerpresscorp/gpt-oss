import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const files = ["README.md", "SUMMARY.md", "SPEC.md", "docs/getting-started.md", "docs/mcp-and-cli.md", "docs/architecture/README.md"];
const errors = [];
for (const file of files) {
  if (!existsSync(file)) { errors.push(`Missing ${file}`); continue; }
  const body = readFileSync(file, "utf8");
  for (const match of body.matchAll(/\[[^\]]+\]\((?!https?:|#|mailto:)([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (target && !existsSync(resolve(dirname(file), target))) errors.push(`${file}: broken link ${match[1]}`);
  }
}
if (!readFileSync("SUMMARY.md", "utf8").startsWith("# Table of contents")) errors.push("SUMMARY.md must start with '# Table of contents'");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`GitBook documentation validated: ${files.length} files, no broken local links.`);
