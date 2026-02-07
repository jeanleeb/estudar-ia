#!/bin/bash
set -e

echo "🔍 Type-checking all configured projects (TypeScript + Python)..."

# Find all tsconfig.json files in apps and libs directories
# excluding node_modules
if [ -d "libs" ]; then
  projects=$(find apps libs -name 'tsconfig.json' -type f -not -path '*/node_modules/*' | sort -u)
else
  projects=$(find apps -name 'tsconfig.json' -type f -not -path '*/node_modules/*' | sort -u)
fi

# Count total projects
if [ -n "$projects" ]; then
  ts_total=$(echo "$projects" | wc -l | tr -d ' ')
else
  ts_total=0
fi

python_total=0
if [ -f "apps/ai-tutor-service/project.json" ]; then
  python_total=1
fi

total=$((ts_total + python_total))
current=0
failed=0

if [ $total -eq 0 ]; then
  echo "⚠️  No projects found for type checking"
  exit 0
fi

echo "Found $total project(s) to check ($ts_total TypeScript, $python_total Python)"
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

if [ $python_total -eq 1 ]; then
  current=$((current + 1))
  echo "[$current/$total] Checking apps/ai-tutor-service..."

  if nx run ai-tutor-service:typecheck; then
    echo "✅ apps/ai-tutor-service passed"
  else
    echo "❌ apps/ai-tutor-service failed"
    failed=$((failed + 1))
  fi
  echo ""
fi

if [ $failed -eq 0 ]; then
  echo "🎉 All projects passed type checking!"
  exit 0
else
  echo "💥 $failed project(s) failed type checking"
  exit 1
fi
