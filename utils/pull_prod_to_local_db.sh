#!/bin/bash

# - github action runs every 24 hours and pulls prod tables into a sql file
# - used townie to write a webhook that pulls the latest prod backup from that
#    azure blob storage bucket
# - this script hits that endpoint and downloads the latest prod backup
# - this script than also imports that sql file into the local db


echo -n "Enter password: "
read -s PASSWORD
echo
curl -X POST \
  https://bmitchinson-getmostrecentazureblob.web.val.run \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"${PASSWORD}\"}" \
  -o latest_prod_backup.sql

psql "postgres://your_username:your_password@localhost:5432/your_database?sslmode=disable" -f latest_prod_backup.sql