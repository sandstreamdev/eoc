#!/bin/bash

echo Extracting packages\' data...

license-checker --json --out licensesChecker.json
npm-license-crawler --json licensesCrawler.json

echo 'Preapring files with licenses...'
node scripts/libs.js
