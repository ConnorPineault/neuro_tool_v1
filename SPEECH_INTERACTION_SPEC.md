# Speech Interaction Spec

## Purpose

This document defines the v1 speech interaction model for the neuroaffirming intake tool.

The goal is to support multimodal access for users who may prefer or require spoken output, spoken input, or a mix of speech and typing.

This spec treats speech as a core accessibility pathway, not as optional polish.

## Core Principles

- TTS and STT are first-class interaction modes.
- The intake engine remains the source of truth.
- The current visible question variant is the source for TTS.
- The editable text field remains the source of truth for submitted answers.
- STT is an input helper, not the final answer.
- The user must always be able to correct, replace, or continue editing speech-generated text.

## TTS Requirements

TTS must:

- read the currently visible question text aloud
- respect the active phrasing mode
- read the simplified or plain-language version if that is what is on screen
- be user-triggered
- be replayable
- stop when the user navigates away from the current question

TTS should not:

- read hidden content that is not currently displayed
- automatically advance the intake
- override user pacing preferences

## STT Requirements

STT must:

- let the user speak an answer
- place the recognized transcript into the visible text field
- allow the user to edit the transcript freely before submission
- allow re-recording or retrying
- support typed input before or after speech input

STT should not:

- lock the user into voice-only interaction
- automatically submit an answer
- prevent manual editing
- treat the raw transcript as the final answer without user review

## Unified Answer Model

For each question, there is one main answer field.

That field may be filled by:

- typing
- STT
- a mix of typing and STT

Submission should use the final field contents, not the original transcript alone.

## UI Controls

### TTS Control

Location:

- directly below the main question

Initial control:

- `Read`

Possible future states:

- `Read`
- `Stop`
- `Replay`

### STT Control

Location:

- embedded inside the text field

Initial control:

- microphone button

Possible future states:

- idle
- listening
- processing
- transcript inserted
- error

## TTS Flow

### Basic Flow

1. The user reaches a question screen.
2. The user presses `Read`.
3. The system reads the currently visible question text aloud.
4. The user may let it finish or stop it.
5. The user may replay it if needed.

### TTS Rules

- if the question is rephrased, TTS should read the new rephrased version
- if the user moves to another question, TTS should stop
- if the user begins STT recording, TTS should stop
- if the user presses `Read` again while already reading, the system should stop or restart predictably

Recommended v1 behavior:

- pressing `Read` while reading stops playback

## STT Flow

### Basic Flow

1. The user reaches a question screen.
2. The user presses the microphone button in the text field.
3. The system enters a listening state.
4. The user speaks.
5. The system stops listening and transcribes.
6. The transcript is inserted into the text field.
7. The user edits the text if needed.
8. The user submits when ready.

### STT Rules

- the user must be able to edit the transcript before submission
- the transcript should appear in the same editable text field used for typing
- the user should be able to retry recording
- if text already exists, the system needs a consistent merge strategy

Recommended v1 behavior:

- if the text field is empty, insert the transcript
- if the text field already has content, append the transcript with a space or line break

## Recommended Speech States

### TTS States

- `idle`
- `reading`
- `stopped`
- `error`

### STT States

- `idle`
- `listening`
- `processing`
- `inserted`
- `error`

## Behavior During Other Actions

### Rephrase

- rephrase changes the visible question text
- TTS should read the newly visible version after rephrase
- rephrase should not erase any answer already typed or transcribed

### Show Example

- examples should remain separate from TTS unless explicitly designed otherwise
- v1 recommendation: TTS reads only the main question, not the examples

### Help

- v1 recommendation: TTS reads only the main question, not the help text

### Back

- any active TTS or STT should stop immediately
- the system should return to the previous question state

### Skip

- any active TTS or STT should stop immediately
- the question is marked skipped

### Pause

- any active TTS or STT should stop immediately
- when unpaused, the question remains available to re-read or re-record

## Error Handling

### TTS Errors

If TTS fails:

- do not block the question flow
- show a small non-disruptive error message
- keep the `Read` control available for retry

### STT Errors

If STT fails:

- do not erase existing typed text
- show a small non-disruptive error message
- allow retry
- allow continued manual typing

## Data Model Recommendations

For each spoken-answer event, the system should be able to store:

- `stt_attempt_id`
- `question_id`
- `raw_speech_transcript`
- `transcript_inserted_into_field`
- `edited_response_text`
- `final_submitted_text`
- `stt_status`
- `timestamp`

Recommended interpretation:

- `raw_speech_transcript` is what the speech system heard
- `edited_response_text` is what the user changed it to before submit
- `final_submitted_text` is the answer the intake engine stores as final

For TTS events, optional logs may include:

- `tts_event_id`
- `question_id`
- `spoken_text`
- `tts_status`
- `timestamp`

## Workshop-Ready Minimum

The minimum workshop-capable speech implementation should support:

- reading the visible question aloud
- recording a spoken response
- inserting the transcript into the answer field
- letting the user edit it before submitting
- stopping speech when navigating away

This is enough to make the tool genuinely multimodal without overbuilding the first implementation.

## Recommended Build Order

1. Implement TTS for the visible question text.
2. Implement STT that inserts transcript into the answer field.
3. Add editable transcript workflow.
4. Add stop/retry/error states.
5. Add separate storage for raw transcript and final submitted answer.
6. Later, refine speech quality and device-specific integrations.

## Open Questions

- should STT record continuously or only while the button is actively engaged
- should transcript insertion append or replace by default when text already exists
- should TTS later support reading examples or help text as an additional option
- how much speech-state feedback should be shown visually without cluttering the UI

## Current Recommendation

For v1:

- keep speech controls simple
- keep the answer field unified
- keep TTS tied to the visible question only
- keep STT editable before submission
- keep the intake engine independent from the speech implementation details
