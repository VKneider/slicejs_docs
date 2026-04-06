---
title: Migration: Single-View to App Shell
route: /Documentation/Architecture/Migration
navLabel: Migration: Single-View to App Shell
section: Project Architecture
group: Styles and Patterns
order: 5
description: Incrementally migrate a single-view Slice app to a shell + multiroute architecture.
component: MigrationSingleViewToAppShellDocumentation
tags: [migration, architecture, multiroute, routing]
---

# Migration: Single-View to App Shell

This migration keeps your app functional while introducing route-based sections.

## Step 1: Add Shell Component
Create an `AppShell` that owns persistent UI (navbar/theme/footer) and hosts section content.

## Step 2: Keep Existing Flow as One Section
Wrap your current single-view root as one section route (for example `/play`).

## Step 3: Add New URL Sections Incrementally
Add new sections only when they are independently navigable and meaningful as URLs.

## Example Migration Route Config
```javascript title="routes.js"
const routes = [
  { path: '/', component: 'AppShell' },
  { path: '/play', component: 'AppShell' },
  { path: '/history', component: 'AppShell' },
  { path: '/settings', component: 'AppShell' },
  { path: '/404', component: 'NotFound' }
];

export default routes;
```

## Example MultiRoute Mapping
```javascript title="AppShell.js"
const page = await slice.build('MultiRoute', {
  routes: [
    { path: '/', component: 'PlayPage' },
    { path: '/play', component: 'PlayPage' },
    { path: '/history', component: 'HistoryPage' },
    { path: '/settings', component: 'SettingsPage' }
  ]
});
```

## Migration Checklist
1. Preserve old entry path behavior while adding shell.
2. Move global controls into shell.
3. Split heavy root view into section components.
4. Keep shared state in context to avoid prop-drilling across sections.
5. Add route guards only when navigation policy requires it.

:::tip
Migrate in small slices. Keep one route stable, move one section at a time, and verify after each move.
:::
