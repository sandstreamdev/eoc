#!/bin/bash

# pass -d <path> to specify target data direcotry
# pass -c <fileName> to specify name of checker temporary file
# pass -r <fileName> to specify name of crawler temporary file
echo Extracting packages\' data...

while getopts d:c:r: option 
do 
 case "${option}" 
 in 
 d) PATH_TO_DATA_FOLDER=$OPTARG;; 
 c) CHECKER_TEMP_FILE_NAME=$OPTARG;; 
 r) CRAWLER_TEMP_FILE_NAME=$OPTARG;; 
 esac 
done 

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

if [ -z "$PATH_TO_DATA_FOLDER" ]; then
  echo 'Path param is missing'
  exit
fi

if [ -z "$CHECKER_TEMP_FILE_NAME"]; then
  CHECKER_TEMP_FILE_NAME="licensesChecker.json"
fi

if [ -z "$CRAWLER_TEMP_FILE_NAME"]; then
  CRAWLER_TEMP_FILE_NAME="licensesCrawler.json"
fi

license-checker --json --out "${SCRIPT_PATH}/${CHECKER_TEMP_FILE_NAME}"
npm-license-crawler --json "${SCRIPT_PATH}/${CRAWLER_TEMP_FILE_NAME}"

echo 'Preapring files with licenses...'
node scripts/libs.js $PATH_TO_DATA_FOLDER $CHECKER_TEMP_FILE_NAME $CRAWLER_TEMP_FILE_NAME
