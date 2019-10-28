#!/bin/bash

echo Extracting packages\' data...

license-checker --json --out packages-checker.json
npm-license-crawler --json packages-crawler.json

echo Preapring files with package licenses...
node scripts/libs.js
