#!/bin/bash

# - github action runs every 24 hours and pulls prod tables into a sql file
# - used townie to write a webhook that pulls the latest prod backup from that
#   azure blob storage bucket
# - this script hits that endpoint and downloads the latest prod backup
# - this script then also imports that sql file into the local db

mode="$1"

if [ "$mode" == "import_only" ]; then
  echo "Skipping backup download and using latest_prod_backup.sql"
else
  echo -n "Enter password to download prod data: "
  read -s PASSWORD
  echo
  curl -X POST \
    https://bmitchinson-getmostrecentazureblob.web.val.run \
    -H "Content-Type: application/json" \
    -d "{\"password\":\"${PASSWORD}\"}" \
    -o utils/latest_prod_backup.sql

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

echo "Data imported successfully ✅"