# Monorepo Scripts

This directory contains scripts for managing the monorepo.

## Type Checking

### `type-check-all.sh`

Automatically type-checks all TypeScript projects in the monorepo.

**Usage:**
```bash
pnpm type-check
```

**How it works:**
- Finds all `tsconfig.json` files in `apps/` and `libs/` directories
- Excludes `node_modules` directories
- Runs `tsc --noEmit` on each project
- Provides clear feedback with progress indicators
- Returns exit code 0 if all projects pass, 1 if any fail

**Features:**
- ✅ Automatically discovers new projects
- ✅ Works with TypeScript path aliases (`@/*`)
- ✅ Handles both `apps/` and `libs/` folders
- ✅ Shows progress for each project
- ✅ Clear success/failure indicators

### Adding New Projects

When you add a new TypeScript project to `apps/` or `libs/`, the type-check script will automatically detect it. Just make sure your project has a `tsconfig.json` file.

Example structure:
```
apps/
  estudar-ia-web/
    tsconfig.json  ← Automatically detected
    src/
      ...
  new-app/
    tsconfig.json  ← Automatically detected
    src/
      ...

libs/
  shared-utils/
    tsconfig.json  ← Automatically detected
    src/
      ...
```

### Alternative Approaches

If you prefer different type-checking strategies:

#### Option 1: Single Command (Current)
Uses the shell script to check all projects sequentially.
```json
"type-check": "bash scripts/type-check-all.sh"
```

#### Option 2: Direct Find Command
Simpler one-liner that checks all projects:
```json
"type-check": "find apps libs -name 'tsconfig.json' -type f -not -path '*/node_modules/*' -exec tsc --project {} --noEmit \\; 2>/dev/null || find apps -name 'tsconfig.json' -type f -not -path '*/node_modules/*' -exec tsc --project {} --noEmit \\;"
```

#### Option 3: Nx Integration
If Nx properly detects your projects, you can use:
```json
"type-check": "nx run-many -t type-check"
```

This requires each project to have a `type-check` target defined.

#### Option 4: Per-Project Scripts
For small monorepos, you can list projects explicitly:
```json
"type-check": "tsc --project apps/estudar-ia-web/tsconfig.json --noEmit && tsc --project apps/other-app/tsconfig.json --noEmit"
```

### Troubleshooting

**Problem:** Type-check doesn't find my project

**Solution:** Ensure your project has a `tsconfig.json` file in its root directory and it's located under `apps/` or `libs/`.

**Problem:** Path aliases not working

**Solution:** Make sure your project's `tsconfig.json`:
1. Extends from `../../tsconfig.base.json`
2. Has `baseUrl` set to `"."`
3. Defines path aliases in `compilerOptions.paths`:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

**Problem:** Script fails with permission denied

**Solution:** Make the script executable:
```bash
chmod +x scripts/type-check-all.sh
```
