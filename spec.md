# Rana's Food Fantasy

## Current State
The backend stores menu items in a non-stable Map, so every deployment erases all admin edits and re-seeds defaults. The `do` block also re-seeds every canister startup regardless.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Make `nextItemId` and `persistentMenuItems` stable so data survives deployments
- Change the seeding logic to only seed if the map is empty (first-time only)

### Remove
- Nothing

## Implementation Plan
1. Add `stable` keyword to `nextItemId` and `persistentMenuItems` declarations
2. Wrap the seed block with a condition: only seed when map is empty
