#!/bin/bash
# Hook: PostToolUse (Edit|Write)
# Runs lint + format + type-check on edited files

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ERRORS=""

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx)
    # Lint + format
    npx biome check --fix "$FILE_PATH" 2>&1 || true

    # Type-check (only the relevant app)
    if [[ "$FILE_PATH" == *"estudar-ia-web"* ]]; then
      TYPE_OUTPUT=$(cd "$PROJECT_DIR/apps/estudar-ia-web" && npx tsc --noEmit 2>&1) || ERRORS="$TYPE_OUTPUT"
    elif [[ "$FILE_PATH" == *"libs/domain"* ]]; then
      TYPE_OUTPUT=$(cd "$PROJECT_DIR/libs/domain" && npx tsc --noEmit 2>&1) || ERRORS="$TYPE_OUTPUT"
    fi
    ;;

  *.py)
    AI_SERVICE_DIR="$PROJECT_DIR/apps/ai-tutor-service"

    # Lint + format
    uv --project "$AI_SERVICE_DIR" run ruff check --fix "$FILE_PATH" 2>&1 || true
    uv --project "$AI_SERVICE_DIR" run ruff format "$FILE_PATH" 2>&1 || true

    # Type-check
    TYPE_OUTPUT=$(uv --project "$AI_SERVICE_DIR" run ty check 2>&1) || ERRORS="$TYPE_OUTPUT"
    ;;
esac

if [ -n "$ERRORS" ]; then
  # Report type errors as additional context to Claude
  cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Type-check errors found after editing $FILE_PATH:\n$ERRORS"
  }
}
EOF
fi

exit 0
