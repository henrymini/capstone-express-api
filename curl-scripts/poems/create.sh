#!/bin/bash

API="http://localhost:4741"
URL_PATH="/poems"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "poem": {
      "title": "'"${TITLE}"'",
      "author": "'"${AUTHOR}"'",
      "body": "'"${BODY}"'",
      "year": "'"${YEAR}"'"
    }
  }'

echo
