#!/usr/bin/env sh
set -eu

backup_dir=${1:?Usage: scripts/restore.sh <backup-directory>}
docker compose down

for volume in got-oss_ollama-models got-oss_open-webui-data; do
  archive="$backup_dir/${volume}.tar.gz"
  test -f "$archive"
  docker volume create "$volume" >/dev/null
  docker run --rm -v "$volume":/target -v "$(pwd)/$backup_dir":/backup:ro alpine:3.22 \
    sh -c "rm -rf /target/* /target/.[!.]* /target/..?* && tar xzf /backup/${volume}.tar.gz -C /target"
done

docker compose up -d

