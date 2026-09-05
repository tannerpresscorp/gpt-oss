import { describe, expect, it } from "vitest";
import { runCli } from "../cli/cli.js";

describe("gpt-oss CLI", () => {
  it("returns a stable JSON doctor result without requiring credentials", async () => {
    const result = await runCli(["--json", "doctor"], { dockerAvailable: async () => true });
    expect(result).toEqual(expect.objectContaining({ ok: true, auth: "not-required", docker: "available" }));
  });
  it("lists a bounded phase selection", async () => {
    const result = await runCli(["--json", "roadmap", "list", "--phase", "4", "--limit", "2"]);
    expect(result).toEqual(expect.objectContaining({ ok: true, count: 2 }));
  });
  it("previews stack startup without executing it", async () => {
    const result = await runCli(["--json", "stack", "start", "--dry-run"]);
    expect(result).toEqual({ ok: true, dryRun: true, command: "docker compose up -d" });
  });
});
