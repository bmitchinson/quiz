#!/bin/bash

# - github action runs every 24 hours and pulls prod tables into a sql file
# - used townie to write a webhook that pulls the latest prod backup from that
#   azure blob storage bucket
# - this script hits that endpoint and downloads the latest prod backup
# - this script then also imports that sql file into the local db

set -e

mode="$1"

if [ "$mode" == "help" ]; then
  printf 'options: \n- "help" \n- "import_only" (dont download)\n- "download_only" (dont import)\n'
  exit 0
fi


if [ "$mode" == "import_only" ]; then
  echo "Skipping backup download and using latest_prod_backup.sql"
else
  echo "if you've had the db up for a while, you may want to down/up to clear it before continuing."
  echo -n "Enter valtown password to download prod data: "
  read -s PASSWORD
  echo
  curl -sS -D utils/latest_prod_headers.txt \
    -H "Content-Type: application/json" \
    -d "{\"password\":\"${PASSWORD}\"}" \
    -o utils/latest_prod_backup.sql \
    https://bmitchinson-getmostrecentazureblob.web.val.run && \
  grep -i '^x-filename:' utils/latest_prod_headers.txt || echo "X-Filename: <missing>"
  sed -i '' -e 's/^\\restrict /-- \\restrict /' -e 's/^\\unrestrict /-- \\unrestrict /' utils/latest_prod_backup.sql

  if [ "$mode" == "download_only" ]; then
    echo "Backup downloaded to utils/latest_prod_backup.sql ✅"
    exit 0
  fi
fi

# reset local db
psql "postgres://your_username:your_password@localhost:5432/your_database?sslmode=disable" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" > /dev/null
npx prisma migrate deploy > /dev/null

# import backup
psql "postgres://your_username:your_password@localhost:5432/your_database?sslmode=disable" -f utils/latest_prod_backup.sql > /dev/null

echo "Data import attempt done"
