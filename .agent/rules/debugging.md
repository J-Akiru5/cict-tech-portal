---
trigger: model_decision
description: When the user asks to debug or fix an error.
---

# Debugging Ruleset for AI Agent

## 1. Error Analysis Protocol
1. **Read the full error message** before making any changes.
2. **Identify the error type:**
   - TypeScript/Type errors → Check interfaces, prop types, and imports
   - Runtime errors → Check variable usage, null checks, and async handling
   - Build errors → Check imports, missing dependencies, and syntax
   - Route errors (404) → Verify route names in [routes/web.php](cci:7://file:///c:/dev/Laravel/Incubator/it-tech-portal/cict-tech-portal/routes/web.php:0:0-0:0) and frontend `route()` calls

## 2. Root Cause Investigation
1. **Trace the error to its source file and line number.**
2. **Check related files:**
   - For TypeScript: Check type definitions in `/types` or at the top of the file.
   - For Laravel: Check models, controllers, and migrations for schema mismatches.
   - For Inertia: Verify prop names match between controller `return` and component props.
3. **Never make assumptions.** Always view the file before editing.

## 3. Fix Prioritization
1. Fix type errors before logic errors.
2. Fix import errors before usage errors.
3. Fix database/migration errors before feature implementation.

## 4. Code Changes
1. **Minimal changes only.** Do not refactor unrelated code.
2. **Preserve existing functionality.** Test that existing features still work.
3. **Use existing patterns.** Match the codebase's naming conventions and structure.
4. **Add null checks** for optional properties (e.g., `auth?.user`, `data?.items`).

## 5. Common Error Patterns

| Error Pattern | Likely Cause | Fix |
|--------------|--------------|-----|
| `Property 'X' does not exist` | Missing interface field or typo | Add to interface or fix spelling |
| `Type 'X' is not assignable to 'Y'` | Type mismatch, often optional vs required | Use `?` or provide default |
| `Cannot read property of undefined` | Null/undefined access | Add null check (`?.`) |
| `Route [X] not defined` | Wrong route name | Check [routes/web.php](cci:7://file:///c:/dev/Laravel/Incubator/it-tech-portal/cict-tech-portal/routes/web.php:0:0-0:0) for correct name |
| `Column already exists` | Migration re-run | Add `Schema::hasColumn()` check |
| `Duplicate identifier` | Import collision | Rename local interface/variable |

## 6. Verification Steps
1. After fixing, **check for new lint errors** introduced by the change.
2. **Run the dev server** and verify the page loads.
3. **Test the specific feature** that was broken.

## 7. Documentation
- Comment non-obvious fixes with `// Fix: [reason]`.
- If the fix reveals a pattern bug, note it for future prevention.