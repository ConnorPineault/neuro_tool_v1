# Engineering V1 Roadmap

## Purpose

This document is the engineering-only companion to `NEUROAFFIRMING_TOOL_GOLD.md`.

Its purpose is to give the team a shorter build-facing plan for v1 while keeping the longer strategy and product reasoning in the main doc.

## V1 Goal

Build a typed-first, neuroaffirming pre-assessment intake prototype for autistic adults that:

- runs on a deterministic intake engine
- supports configurable interaction preferences
- captures structured responses and summaries
- produces a structured report payload
- leaves room for later Mac Studio local-LLM integration

For v1, the local Mac Studio model is not the critical path. The intake engine is.

## Non-Goals For V1

- final clinical wording
- finalized clinical section list
- real-time scoring or interpretation
- diagnosis suggestions
- fully open-ended chatbot behavior
- production-grade live voice mode

## Core Build Decisions

- The state machine owns flow.
- JSON config owns sections, questions, follow-up rules, and preferences.
- The frontend is typed-first.
- Rephrase, example, skip, summary, and review are first-class actions.
- The report payload is structured data first, prose second.
- The future Mac Studio-hosted LLM plugs in as a controlled language layer only.

## Current Scaffolds

The workspace now contains draft scaffolds in `/scaffolds`:

- `sections.v1.json`
- `questions.v1.json`
- `followups.v1.json`
- `interaction_preferences.v1.json`

These are placeholder artifacts pending clinical review.

## Suggested Implementation Shape

### Backend

Needed modules:

- config loader for sections, questions, follow-ups, and preferences
- session state machine
- response persistence layer
- summary/report payload builder
- future LLM adapter interface

Suggested responsibilities:

- validate config integrity
- enforce section order
- enforce mandatory-core question handling
- allow skip/rephrase/example actions
- store raw and normalized responses
- build review and export payloads

### Frontend

Needed views:

- welcome / orientation
- answer mode + preferences
- question view
- section summary view
- review and edit view
- completion view

Needed persistent controls:

- rephrase
- example
- repeat
- skip
- pause
- change preferences

### Data

Minimum persisted objects:

- intake session
- participant profile
- interaction preferences snapshot
- response records
- section summaries
- report payload

## Delivery Phases

### Phase 1: Engine Skeleton

- load scaffold JSON
- validate references between sections, questions, and follow-up rules
- implement session model
- implement linear section/question traversal

### Phase 2: Typed-First UI

- build one-question-at-a-time screen
- wire answer / skip / pause
- wire preference changes
- display section summaries

### Phase 3: Output And Review

- build structured report payload generation
- build review screen with skipped/open items
- support editing prior responses

### Phase 4: Controlled Language Layer

- define LLM adapter contract
- plug in rephrase, examples, acknowledgements, and summaries
- keep next-question logic outside the model

### Phase 5: Voice Extension

- add speech input
- add read-aloud
- test structured capture reliability during conversational use

## Open Engineering Questions

- what app stack we want for the prototype
- what persistence layer we want for local sessions
- whether configs should stay as JSON or move to typed source files later
- how to represent normalized responses for clinician/research export
- how to version changing clinical content safely

## Recommended Immediate Tasks

1. Create a small app shell that loads `sections.v1.json` and `questions.v1.json`.
2. Implement config validation so missing question references fail early.
3. Build the question screen with `answer`, `skip`, `rephrase`, and `example` actions.
4. Persist responses into a draft `report_payload`.
5. Add a simple section summary and review screen.

## Definition Of Progress

The v1 prototype is meaningfully underway when:

- a user can complete the scaffold intake end-to-end in text mode
- preferences change the interaction in visible ways
- skipped items remain visible
- summaries are confirmable and editable
- a structured report payload is produced at the end

## Later Mac Studio Integration

When the Mac Studio is available, the local model should be introduced through a narrow interface for:

- question rendering
- rephrasing
- example starters
- acknowledgements
- brief summaries

It should not own:

- intake flow
- report structure
- question selection
- scoring
- diagnosis-like outputs
