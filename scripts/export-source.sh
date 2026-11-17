#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel)"
OUTPUT_DIR="$REPO_ROOT/source-export"
ZIP_FILE="$REPO_ROOT/source-export.zip"

rm -rf -- "$OUTPUT_DIR"
mkdir -p -- "$OUTPUT_DIR"

git -C "$REPO_ROOT" archive --format=tar HEAD | tar -xf - -C "$OUTPUT_DIR"
git -C "$REPO_ROOT" archive --format=zip --output="$ZIP_FILE" HEAD

printf 'Exported committed Git files to %s\nCreated ZIP archive %s\n' "$OUTPUT_DIR" "$ZIP_FILE"
