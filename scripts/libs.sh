#!/bin/bash

# pass -j path/path/to/the/json/file
# pass [-m path/path/to/the/markdown/file]
echo Extracting packages\' data...

while getopts j:m: option 
do 
 case "${option}" 
 in 
 j) PATH_TO_JSON_FILE=$OPTARG;;
 m) PATH_TO_MD_FILE=$OPTARG;; 
 esac 
done 

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
CHECKER_TEMP_FILE="${SCRIPT_PATH}/licensesChecker.json"
CRAWLER_TEMP_FILE="${SCRIPT_PATH}/licensesCrawler.json"

if [ -z "$PATH_TO_JSON_FILE" ]; then
  echo 'Path to json file is missing'
  exit
fi

if [ -z "$PATH_T0_MD_FILE"]; then
  PATH_T0_MD_FILE="LIBRAIRES.md"
fi

license-checker --json --out "${CHECKER_TEMP_FILE}"
npm-license-crawler --json "${CRAWLER_TEMP_FILE}"

echo 'Preapring files with licenses...'
node scripts/libs.js $PATH_TO_JSON_FILE $PATH_TO_MD_FILE $CHECKER_TEMP_FILE $CRAWLER_TEMP_FILE
