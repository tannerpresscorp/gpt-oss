#!/usr/bin/env sh
set -eu

backup_dir=${1:-backups/$(date +%Y%m%dT%H%M%SZ)}
mkdir -p "$backup_dir"

for volume in got-oss_ollama-models got-oss_open-webui-data; do
  docker volume inspect "$volume" >/dev/null
  docker run --rm -v "$volume":/source:ro -v "$(pwd)/$backup_dir":/backup alpine:3.22 \
    tar czf "/backup/${volume}.tar.gz" -C /source .
done

echo "Backups written to $backup_dir"

