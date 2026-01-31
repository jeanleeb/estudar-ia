#!/bin/bash
set -e

echo "🔍 Type-checking all TypeScript projects..."

# Find all tsconfig.json files in apps and libs directories
# excluding node_modules
if [ -d "libs" ]; then
  projects=$(find apps libs -name 'tsconfig.json' -type f -not -path '*/node_modules/*' | sort -u)
else
  projects=$(find apps -name 'tsconfig.json' -type f -not -path '*/node_modules/*' | sort -u)
fi

if [ -z "$projects" ]; then
  echo "⚠️  No TypeScript projects found"
  exit 0
fi

# Count total projects
total=$(echo "$projects" | wc -l | tr -d ' ')
current=0
failed=0

echo "Found $total project(s) to check"
echo ""

# Type check each project
for project in $projects; do
  current=$((current + 1))
  project_name=$(dirname "$project")
  echo "[$current/$total] Checking $project_name..."

  if tsc --project "$project" --noEmit; then
    echo "✅ $project_name passed"
  else
    echo "❌ $project_name failed"
    failed=$((failed + 1))
  fi
  echo ""
done

if [ $failed -eq 0 ]; then
  echo "🎉 All projects passed type checking!"
  exit 0
else
  echo "💥 $failed project(s) failed type checking"
  exit 1
fi
