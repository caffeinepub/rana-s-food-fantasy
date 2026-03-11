# Rana's Food Fantasy

## Current State
The app has a public homepage with menu display and an admin panel at `/admin`. Admin access requires Internet Identity (blockchain login) + admin role assignment. Every redeploy resets admin roles, causing permanent "Access Denied" errors. Menu display works on public homepage but admin panel is inaccessible.

## Requested Changes (Diff)

### Add
- Simple password-based admin login (password: `RanaAdmin2024`) — no Internet Identity required

### Modify
- Backend: Remove admin role checks from all menu mutation functions (addPersistentMenuItem, updatePersistentMenuItem, deletePersistentMenuItem, seedSampleItems) — make them callable by anyone
- Frontend AdminPage: Replace Internet Identity login flow with a simple password input form

### Remove
- Internet Identity dependency from AdminPage
- `useIsCallerAdmin` check that was causing Access Denied
- `useInternetIdentity` hook usage in AdminPage

## Implementation Plan
1. Update `src/backend/main.mo` — remove all `AccessControl.isAdmin` checks from menu functions
2. Update `src/frontend/src/pages/AdminPage.tsx` — replace Internet Identity with password login
