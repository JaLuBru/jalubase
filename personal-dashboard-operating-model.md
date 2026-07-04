# Personal Dashboard Operating Model

## Project Goal

Build a low-friction personal dashboard that helps capture scattered thoughts, commitments, references, and plans, then resurfaces the right things at the right time so important items do not disappear just because they are out of sight.

## Core Decision

The dashboard should primarily help answer:

> What deserves my attention now, and what should be intentionally remembered for later?

## First Priority

The first usable version will prioritize broad capture and remembering everything.

Daily attention, task planning, and routines will be built on top of that capture and memory foundation rather than becoming the first center of gravity.

## Product Principles

1. Resurfacing matters more than perfect organization.
2. Capture must be fast enough to use from an iPhone lock screen or Apple Watch.
3. Existing tools should be respected before they are replaced.
4. The first version should become useful quickly, then expand.
5. The dashboard should feel supportive, not punitive.

## Primary Life Domains

- Projects
- Learning
- Relationships
- Things to remember
- Health

## Initial Capture Types

- Raw thought
- Task
- Link
- Quote
- Thing to buy
- Book note
- Audiobook note
- Movie note
- Person note
- Health note
- Project note
- Learning note

## First Version Scope

- Quick capture inbox
- Memory library
- Basic resurfacing
- Basic people notes
- Basic learning notes
- Search across saved items
- Docker-ready project structure

## First Version Non-Goals

- Replace Apple Calendar
- Replace Apple Reminders
- Replace Obsidian
- Replace Raindrop
- Replace StoryGraph or Letterboxd
- Replace health, banking, or finance apps
- Build a perfect AI organizer immediately

## Technical Direction

- Local laptop version for fast iteration
- Docker Compose version for Proxmox deployment
- GitHub repository as the source of truth
- Server can later pull from GitHub and restart the Docker app

## Confirmed Decision Log

- 2026-07-05: First version should focus on broad capture and remembering everything before daily task planning.
