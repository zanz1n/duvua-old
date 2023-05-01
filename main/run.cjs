#!/usr/bin/env node
"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
const { spawnSync } = require("child_process");
spawnSync("rm", ["-r", "./dist"], { stdio: "inherit" });
const buildProcess = spawnSync("pnpm", ["tsc"], { stdio: "inherit" });
if (buildProcess.status !== 0) {
    process.exit(buildProcess.status);
}
const result = spawnSync("node", ["./dist/index.js"], { stdio: "inherit" });
process.exit(result.status ?? 0);
