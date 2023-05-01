#!/bin/sh

cd /bot

pnpm --filter main db:push &&
cd main &&
node dist/index.js
