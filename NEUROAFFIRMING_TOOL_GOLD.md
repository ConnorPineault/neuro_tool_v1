# Neuroaffirming Tool Gold

## Vision

Build a conversational agent for autism-related pre-assessment that is grounded in our own data, accessible by design, and explicitly neuroaffirming in how it asks questions, adapts its communication, and supports different interaction styles.

This is not a generic chatbot. It is a guided, respectful, multimodal pre-assessment tool that:

- asks questions from a controlled list we are studying and validating
- uses our autism-related materials, intake forms, and language guidance
- supports typed and spoken interaction
- allows visual and pacing customization
- is designed for safety, clarity, and low-friction communication

## Why The M3 Ultra Matters

The M3 Ultra is valuable for this project, but not because it lets us train a frontier model from scratch. Its real value is that it gives us a powerful local development and evaluation environment for a private, multimodal, research-oriented agent stack.

The best use of the machine is to help us:

- run local models for fast iteration
- prototype multimodal interaction on-device
- evaluate conversation quality at scale
- keep sensitive drafts and internal materials private
- build a researchable system we can later validate and deploy

Apple positions the Mac Studio with M3 Ultra as capable of running large models locally, starting at 96GB unified memory. Apple’s MLX ecosystem and Human Interface Guidelines also make it a strong fit for accessible, adaptive product design.

## Product Goal

The goal is to create a conversational pre-assessment experience that combines:

1. Backend intelligence grounded in autism-related data, intake forms, accessibility guidance, and neuroaffirming communication standards.
2. A frontend experience that feels safe, flexible, multimodal, and low-friction for different communication preferences.

The immediate focus is not deployment. The immediate focus is building a strong prototype and research platform that we can study, refine, and validate.

## V1 Scope

The first version should be a neuroaffirming, multimodal pre-assessment intake tool for autistic adults.

Primary users:

- autistic adults completing their own intake
- some caregivers supporting completion
- some people with intellectual disabilities who may complete the intake independently, with support, or through partial caregiver assistance

This means the system must support:

- direct self-report as the default mode
- optional supported completion with a caregiver
- flexible communication demands
- simplified phrasing when needed
- a respectful experience that does not assume incompetence or override the person’s perspective

## Core Product Principles

### 1. Neuroaffirming By Default

The system should use language that is respectful, clear, non-pathologizing, and adaptable to different communication styles. It should help people feel understood, not managed.

### 2. Accessibility Is Core Functionality

Accessibility is not a settings-page afterthought. The interaction model itself should reduce overload, ambiguity, and communication friction.

### 3. Controlled Assessment Flow

The model should not invent the assessment pathway. Question flow needs to come from a studied and controlled structure so the experience stays consistent enough to evaluate scientifically.

### 4. Separation Of Concerns

We should separate:

- source knowledge
- dialogue control
- language generation
- UI adaptation

This makes the system easier to audit, update, validate, and study.

### 5. Self-Report First, Support When Needed

The tool should be oriented around the autistic adult’s own account whenever possible, while still supporting caregiver participation when needed for communication, memory, daily support context, or safety-related details.

### 6. Adjustable Interaction Style

The system’s tone, pacing, and presentation should be adjustable to the user’s preference. Adaptation should be explicit and user-controlled rather than inferred behind the scenes.

## What “Trained On Our Data” Should Mean

For this product, “trained on our data” should not mean dumping documents into a model and hoping for the best.

A better interpretation is a combination of:

- retrieval-augmented generation over our internal materials
- small supervised fine-tuning on high-quality example conversations
- explicit dialogue policy and interaction rules
- structured prompts and output schemas
- interface constraints that reduce overload and ambiguity

This is a better fit because it is:

- easier to update
- easier to audit
- easier to study scientifically
- easier to validate for wording and safety
- easier to separate knowledge from behavior

For a clinical-adjacent research workflow, that separation is extremely important.

## Recommended System Architecture

The strongest direction is not one monolithic model. It is a three-layer system.

### Layer A: Conversation Orchestrator

This layer should be mostly deterministic. It controls:

- which question comes next
- when to rephrase
- when to pause
- when to offer examples
- when to confirm understanding
- when to summarize
- when to allow skipping or returning later
- when to switch or offer another modality

This is where consistency and study control live.

### Intake Flow Pattern

The intake should use:

- fixed mandatory core questions
- optional follow-up questions
- explicit permission to skip
- section-level summaries
- clarification only when needed

The model should not freely branch into unapproved content areas. Optional follow-ups should be triggered by predefined rules, user requests for clarification, or incomplete answers to core questions.

### Intake Entry Modes

The system should support different answering modes from the start of the intake.

Initial mode selection should likely include:

- self-report
- caregiver-supported
- answering together

This mode should affect:

- pronoun and participant wording
- whether the assistant asks who is speaking
- whether questions are directed to the autistic adult, the caregiver, or both
- how summaries attribute information
- whether the system prompts for direct self-report before caregiver interpretation when appropriate

The autistic adult’s perspective should remain primary whenever possible, while still allowing supported completion when needed.

### Preference Capture At The Start

The tool should ask communication and interface preferences near the beginning of the intake.

Early preference capture should include:

- typed input, spoken input, or both
- whether prompts should be shorter or more conversational
- whether the user wants examples offered proactively or only on request
- whether the assistant should use a warm, neutral, or highly structured style
- whether read-aloud is wanted
- whether the pace should be slower with more pauses
- whether the assistant should summarize before moving on

These preferences should be adjustable throughout the intake and not locked after the initial choice.

### Draft Section Map Based On Current Consult Note

The current consult note is a useful source for structure, but it needs to be translated from clinician-centered language into neuroaffirming, participant-facing language.

Current high-level sections that appear worth carrying forward:

- referral reason or reason for seeking support
- identifying information and living/support context
- communication profile and accessibility needs
- current concerns, stressors, and recent changes
- behavior or distress episodes, including triggers, patterns, and impact
- mood, enjoyment, sleep, appetite, energy, impulsivity, and attention
- psychiatric history
- medical history
- medications
- substance use
- legal context
- family history
- developmental history

Sections that likely need careful reframing or strong review before reuse:

- language focused on “behaviors” as the primary lens
- assumptions about proxy decision-making
- assumptions about insight, judgment, or cognition
- mental-status style observational language written from a clinician perspective

For the product, we should convert these into participant-safe sections that ask about experience, context, support needs, distress, functioning, and change over time without pathologizing or overriding the user’s framing.

Clinical content decisions that remain intentionally open for now:

- which consult-note sections stay in v1
- which sections are removed, delayed, or clinician-only
- how to frame “behavior” language in a more neuroaffirming way
- whether developmental history is in v1 or deferred
- which mental health and functioning questions belong in the intake versus later clinical review

These should be treated as content-governance decisions owned by the clinical team, not improvised by the model or product layer.

### Layer B: Knowledge Layer

This layer grounds the system using retrieval over:

- intake questions
- autism assessment guidance
- neuroaffirming language guidance
- communication preference guidance
- accessibility best practices
- internal examples of strong interactions
- study protocol documents

This layer should provide evidence and guardrails for the language the model uses.

### Layer C: Model Layer

The language model should handle:

- phrasing prompts naturally
- clarifying unclear answers
- summarizing what the user shared
- reflecting back information respectfully
- adapting tone within strict constraints

The model should be constrained by the orchestrator and knowledge layer, not treated as the whole system.

## Assistant Behavior Spec

The assistant should be allowed to:

- ask the next approved question
- ask a bounded clarification question when the answer is incomplete or ambiguous
- rephrase a question on request
- offer a starter or example on request, or when the user indicates they are stuck
- summarize a response or section before moving on
- acknowledge skips without pressure

The assistant should not:

- interpret answers in real time
- score responses in real time
- suggest a diagnosis
- challenge the user’s framing of their own experience
- use clinical, deficit-based, or pathologizing wording unless directly quoting source material for internal use
- infer emotion, intent, or meaning unless the user explicitly states it
- invent new assessment domains outside the approved intake structure

### Clarification Rules

Clarification should be limited and purposeful.

The assistant may ask a clarification question when:

- the answer does not contain enough information to continue
- the user gives a broad answer and the intake requires one missing detail
- a mandatory question has been partially answered

The assistant should not repeatedly press for clarification after a skip, refusal, or clear sign that the user wants to move on.

### Summary Rules

Summaries should:

- be brief
- use the user’s own framing where possible
- invite correction
- avoid interpretation
- help the user confirm accuracy before moving on

Example summary behavior:

- “Here’s what I’ve captured so far. Tell me if I missed anything or got anything wrong.”

## Tone And Adaptation Spec

Tone should be adjustable by the user instead of fixed globally.

The system should support selectable interaction styles such as:

- warm and gently supportive
- neutral and plainspoken
- highly structured and concise
- slower paced with more explanation
- lower-affect and minimal

User-facing adaptation controls should include:

- how much explanation to give
- whether examples are offered proactively or only on request
- pacing speed
- whether the assistant reflects answers back before moving on
- whether prompts are shorter or more conversational

The system should avoid pretending to infer the user’s preferred tone based only on behavior. It should ask or let the user choose.

## Open Clinical Decisions

The following questions should be resolved with clinical leadership before the intake flow is finalized:

- the final section list for v1
- the exact mandatory core questions
- the exact optional follow-up questions
- preferred framing for distress, meltdowns, shutdowns, risk, and safety-related experiences
- whether developmental history belongs in this tool
- how mood, sleep, appetite, impulsivity, attention, and psychosis-related content should be framed or staged
- which questions are appropriate for self-report, caregiver-report, or both

## Technical Work That Can Proceed Before Clinical Finalization

The product and engineering team can move forward now on:

- building the conversation state machine format
- defining support for self-report, caregiver-supported, and joint-answer modes
- designing the preference-capture step
- implementing skip, rephrase, clarify, and summarize actions
- building section and question schemas with placeholders for clinical content
- creating UI controls for pacing, tone, prompt length, read-aloud, and input modality
- defining structured output formats for captured answers and summaries
- creating evaluation tooling for adherence to flow and language rules

This allows technical progress without forcing unresolved clinical-content choices too early.

## Backend Recommendation

The backend should be designed for privacy, auditability, and repeatable evaluation.

Recommended stack direction:

- `MLX` / `mlx-lm` for Apple-silicon-native local inference where possible
- a local embedding model for retrieval
- a vector store such as `FAISS` or `Chroma`
- a strict dialogue state machine for assessment flow
- structured JSON outputs from the model
- an evaluation harness for transcript review and conversation quality testing

### Backend Responsibilities

- ground responses in our internal autism-related materials
- control question progression from the approved list
- enforce response boundaries and conversation policies
- log structured interaction data for study and evaluation
- support future fine-tuning and validation workflows

## V1 Intake Engine Specification

This section defines the draft technical shape of the intake engine for v1.

The goal of v1 is not to finalize the clinical content. The goal is to build a structured, neuroaffirming intake framework that can later be populated with approved clinical sections and questions.

For v1, the system should be built so that:

- content can be revised without rewriting orchestration logic
- the frontend can support multimodal interaction from the beginning
- the backend can swap in a local Mac Studio-hosted model later as the main LLM layer
- question flow remains deterministic even when an LLM is used for phrasing and summaries

### V1 Architecture Boundary

For now, the intake engine should be treated as the primary product artifact.

That means:

- the state machine is the source of truth
- question definitions are structured data
- summaries, rephrasings, and clarifications are controlled outputs
- the LLM is an assistant layer, not the owner of flow

The end-state direction is that the Mac Studio model becomes the local background LLM for:

- phrasing questions naturally
- rephrasing when requested
- generating brief summaries
- turning approved question content into accessible conversational turns

Even after that integration, the model should not decide what the assessment includes or what comes next.

### Core Objects

The v1 intake engine should be designed around the following objects:

- `intake_session`
- `participant_profile`
- `interaction_preferences`
- `section_definition`
- `question_definition`
- `followup_rule`
- `response_record`
- `section_summary`
- `session_summary`

### `intake_session`

Represents one active or completed intake.

Suggested fields:

- `session_id`
- `created_at`
- `updated_at`
- `status`
- `answer_mode`
- `current_section_id`
- `current_question_id`
- `completed_section_ids`
- `skipped_question_ids`
- `flagged_for_review`
- `participant_profile_id`
- `interaction_preferences_id`

Example statuses:

- `not_started`
- `in_progress`
- `paused`
- `completed`
- `review_needed`

Example answer modes:

- `self`
- `caregiver_supported`
- `together`

### `participant_profile`

Represents context needed to present the intake appropriately without forcing clinical interpretation.

Suggested fields:

- `display_name`
- `pronouns`
- `age_band`
- `answer_mode`
- `support_person_present`
- `communication_notes`
- `accessibility_notes`

This object should remain minimal in v1 and only capture what is needed to adapt the experience.

### `interaction_preferences`

Represents the user’s chosen communication and interface settings.

Suggested fields:

- `input_mode`
- `output_mode`
- `tone_style`
- `prompt_length`
- `pace`
- `offer_examples_mode`
- `summarize_before_next`
- `read_aloud_enabled`
- `confirm_before_advance`

Example values:

- `input_mode`: `text`, `voice`, `mixed`
- `output_mode`: `text`, `text_tts`
- `tone_style`: `warm`, `neutral`, `structured`, `minimal`
- `prompt_length`: `short`, `standard`, `expanded`
- `pace`: `standard`, `slow`
- `offer_examples_mode`: `on_request`, `proactive`

These settings should be editable during the intake.

### `interaction_preferences` V1 Detail

For v1, these preferences should be grouped into five areas:

- input and output
- tone and phrasing
- pacing and turn-taking
- cognitive load and visual presentation
- confirmation and summaries

#### Input And Output Preferences

Suggested options:

- `input_mode`
  - `text`
  - `voice`
  - `mixed`
- `output_mode`
  - `text_only`
  - `text_with_read_aloud`
- `voice_reply_mode`
  - `off`
  - `on_demand`
  - `always_on`
- `captions_enabled`
- `repeat_button_enabled`

#### Tone And Phrasing Preferences

Suggested options:

- `tone_style`
  - `warm`
  - `neutral`
  - `structured`
  - `minimal`
- `prompt_length`
  - `short`
  - `standard`
  - `expanded`
- `use_plain_language`
- `offer_examples_mode`
  - `on_request`
  - `proactive`
- `rephrase_style`
  - `simpler`
  - `more_detailed`
  - `same_meaning_different_words`

#### Pacing And Turn-Taking Preferences

Suggested options:

- `pace`
  - `standard`
  - `slow`
- `auto_advance`
  - `never`
  - `after_confirmation`
- `pause_between_turns_ms`
- `allow_interruptions_during_read_aloud`
- `wait_for_user_confirmation_before_next_question`

#### Cognitive Load And Visual Presentation Preferences

Suggested options:

- `show_one_question_at_a_time`
- `show_progress_indicator`
- `progress_style`
  - `section_only`
  - `detailed`
  - `hidden`
- `font_size`
  - `standard`
  - `large`
  - `extra_large`
- `contrast_mode`
  - `default`
  - `high_contrast`
  - `soft_contrast`
- `reduced_motion`
- `hide_nonessential_ui`

#### Confirmation And Summary Preferences

Suggested options:

- `summarize_before_next`
- `summary_length`
  - `brief`
  - `standard`
- `confirm_captured_answer`
- `allow_edit_after_summary`
- `review_section_before_submit`

### V1 Preference Capture Flow

The preference step should be short and non-overwhelming.

Recommended v1 pattern:

1. Ask who is answering: `self`, `caregiver_supported`, or `together`.
2. Ask preferred input mode: `text`, `voice`, or `mixed`.
3. Ask whether the user wants shorter prompts, more support/examples, or a more neutral/structured style.
4. Ask whether read-aloud and summaries are wanted.
5. Offer a lightweight “change these anytime” reminder.

The initial setup should avoid dumping every option on the user at once. Advanced settings can be adjusted during the intake.

### V1 Frontend Controls For Preferences

The frontend should expose a small persistent control area for:

- change input mode
- repeat prompt
- rephrase prompt
- ask for example
- change pace
- toggle read-aloud
- change prompt style
- pause and resume

This matters because preference control should remain available in context, not buried in a settings page.

### `section_definition`

Represents a logical intake section.

Suggested fields:

- `section_id`
- `title`
- `description`
- `order_index`
- `is_required`
- `entry_prompt`
- `closing_prompt`
- `summary_enabled`
- `question_ids`

Examples of draft section placeholders for v1:

- `intro_and_preferences`
- `reason_for_intake`
- `communication_and_support_context`
- `current_experiences_and_concerns`
- `health_and_history`
- `review_and_close`

These are scaffolding sections only and should remain easy to rename or split once the clinical team finalizes content.

### `question_definition`

Represents one approved question in the intake engine.

Suggested fields:

- `question_id`
- `section_id`
- `prompt_text`
- `plain_language_variant`
- `short_variant`
- `example_starters`
- `help_text`
- `response_type`
- `is_mandatory_core`
- `is_skippable`
- `allow_rephrase`
- `allow_examples`
- `allow_summary`
- `followup_rule_ids`
- `clinical_owner_status`

Example `response_type` values:

- `free_text`
- `short_text`
- `single_select`
- `multi_select`
- `yes_no`
- `scaled_choice`

Example `clinical_owner_status` values:

- `draft`
- `under_review`
- `approved`

### `followup_rule`

Represents a controlled reason to ask an optional follow-up.

Suggested fields:

- `followup_rule_id`
- `parent_question_id`
- `trigger_type`
- `trigger_condition`
- `followup_question_id`
- `max_followups`

Example trigger types:

- `missing_required_detail`
- `user_requested_example`
- `user_requested_rephrase`
- `answer_contains_flag`
- `mode_specific`

Follow-ups should never be unconstrained free-form exploration.

### `response_record`

Represents the captured response to a question.

Suggested fields:

- `response_id`
- `session_id`
- `question_id`
- `raw_response`
- `normalized_response`
- `input_modality`
- `answered_by`
- `was_skipped`
- `skip_reason`
- `clarification_used`
- `rephrase_used`
- `examples_offered`
- `user_confirmed_summary`
- `timestamp`

Example `answered_by` values:

- `participant`
- `caregiver`
- `both`

### `section_summary`

Represents a brief recap shown before moving on.

Suggested fields:

- `section_id`
- `summary_text`
- `user_confirmed`
- `user_corrections`

This summary should be editable or correctable before the intake advances.

### `session_summary`

Represents the structured output of the intake.

Suggested fields:

- `session_id`
- `completed_sections`
- `skipped_items`
- `open_items`
- `participant_preference_snapshot`
- `final_summary_text`
- `export_payload`

## V1 Report And Output Schema

The intake engine should produce a structured output that can support:

- clinician review
- research review
- internal quality checks
- later narrative report generation

For v1, the system should treat the report payload as a structured data object first and a prose report second.

### Report Design Principles

- captured information should remain linked to its source question
- skipped items should remain visible instead of being silently omitted
- self-report and caregiver-report should remain distinguishable
- summaries should be editable and attributable
- narrative output should be generated from confirmed structured data, not from vague conversational memory

### Suggested `report_payload` Shape

```json
{
  "report_id": "string",
  "session_id": "string",
  "generated_at": "ISO-8601 timestamp",
  "answer_mode": "self | caregiver_supported | together",
  "participant_profile": {
    "display_name": "string",
    "pronouns": "string",
    "age_band": "string"
  },
  "interaction_preferences_snapshot": {
    "input_mode": "text | voice | mixed",
    "tone_style": "warm | neutral | structured | minimal",
    "prompt_length": "short | standard | expanded",
    "pace": "standard | slow",
    "read_aloud_enabled": true
  },
  "sections": [
    {
      "section_id": "string",
      "title": "string",
      "status": "completed | partial | skipped",
      "summary_text": "string",
      "responses": [
        {
          "question_id": "string",
          "prompt_text": "string",
          "answered_by": "participant | caregiver | both",
          "raw_response": "string",
          "normalized_response": "object or string",
          "was_skipped": false,
          "skip_reason": null,
          "confidence": "confirmed | unconfirmed",
          "user_corrections": []
        }
      ]
    }
  ],
  "open_items": [
    {
      "question_id": "string",
      "reason": "skipped | incomplete | needs_clinical_followup"
    }
  ],
  "final_summary_text": "string"
}
```

### V1 Output Layers

The system should produce three output layers:

#### 1. Structured Intake Record

This is the source of truth.

It should include:

- all responses
- skipped items
- who answered
- what preferences were active
- confirmed section summaries

#### 2. Human-Readable Review Summary

This is a concise, readable view for clinicians or researchers.

It should include:

- reason for intake
- communication and support context
- key current concerns
- notable areas requiring follow-up
- unanswered or skipped core questions

#### 3. Narrative Draft Report

This should be optional in v1.

If generated, it should:

- be clearly labeled as a draft
- be derived from confirmed structured data
- preserve uncertainty and skipped items
- avoid adding interpretation or diagnosis

### Narrative Generation Rules

If the system generates prose for review, it should:

- use neutral, respectful, non-pathologizing language
- attribute perspective when relevant
- distinguish direct self-report from caregiver input
- avoid filling in gaps that were not answered
- mark incomplete sections clearly

Example attribution patterns:

- `The participant shared that...`
- `The caregiver reported that...`
- `The participant and caregiver described...`

### Report Population During Conversational Use

If voice or live conversation is enabled later, the report should be populated incrementally.

That means:

- each answer is captured against an active question
- structured extraction runs after each turn
- the user can confirm or correct the captured content
- the report object is updated continuously

This is preferable to generating the whole report only after the conversation ends.

## Current Status

The project now has a strong v1 direction at the product-system level.

What is now defined in this document:

- the product vision and M3 Ultra role
- the v1 scope and target users
- core product principles
- a non-naive definition of “trained on our data”
- the orchestrated three-layer architecture
- entry modes for self, caregiver-supported, and joint completion
- the assistant behavior rules
- tone and adaptation rules
- the intake engine core objects
- the `interaction_preferences` model
- the state machine direction
- the future Mac Studio LLM integration boundary
- the report and output schema direction

What remains intentionally unresolved:

- final clinical section list
- final question wording
- final follow-up logic tied to approved content
- clinical review rules for high-sensitivity topics

That is a good place to be for a v1 technical/product draft.

## High-Level Next Steps

### Immediate Next Steps

- convert placeholder sections into draft `section_definition` objects
- create a small set of example `question_definition` objects for one or two sections
- define the frontend screen flow for entry mode, preferences, question view, summary, and review
- define the structured export format engineering will persist

### After That

- review section structure with the clinical team
- replace placeholders with approved clinical content
- build a typed-first prototype against the state machine
- test summaries, rephrases, skip behavior, and preference changes

### Later, When The Mac Studio Is In Place

- integrate the local model for question rendering, rephrasing, summaries, and acknowledgements
- test voice input and read-aloud
- add controlled conversational voice mode
- evaluate transcription accuracy and structured extraction reliability
- compare local model behaviors against the language and safety spec

## Recommended Build Order

1. Finalize the intake engine schema.
2. Draft placeholder sections and questions.
3. Build the typed-first prototype.
4. Validate workflow and output structure with the clinical team.
5. Integrate the local Mac Studio LLM as a controlled language layer.
6. Add voice and live conversational features after structured capture is stable.

## Placeholder V1 Scaffolding Pending Clinical Review

The following sections and questions are implementation scaffolding only.

They are meant to:

- give engineering a concrete shape to build against
- help product and clinical reviewers react to something tangible
- remain easy to revise once the clinical team approves the real content

They are not final clinical wording.

### Draft `section_definition` Objects

```json
[
  {
    "section_id": "intro_and_preferences",
    "title": "Getting Started",
    "description": "Identify who is answering and how the user wants the intake to work.",
    "order_index": 1,
    "is_required": true,
    "entry_prompt": "We can set this up in a way that works best for you.",
    "closing_prompt": "Thanks. We can change any of these settings later.",
    "summary_enabled": false,
    "question_ids": [
      "answer_mode_001",
      "input_mode_001",
      "prompt_style_001",
      "read_aloud_001"
    ]
  },
  {
    "section_id": "reason_for_intake",
    "title": "Reason For Intake",
    "description": "Capture why the person is doing the intake and what feels most important.",
    "order_index": 2,
    "is_required": true,
    "entry_prompt": "We’ll start with what brought you here and what feels important to share.",
    "closing_prompt": "Thanks. I’ll keep that in mind as we continue.",
    "summary_enabled": true,
    "question_ids": [
      "reason_for_intake_001",
      "reason_for_intake_002"
    ]
  },
  {
    "section_id": "communication_and_support_context",
    "title": "Communication And Support",
    "description": "Capture communication preferences and support context.",
    "order_index": 3,
    "is_required": true,
    "entry_prompt": "Next, I’ll ask a few questions about communication and support needs.",
    "closing_prompt": "Thanks. That helps shape the rest of the intake.",
    "summary_enabled": true,
    "question_ids": [
      "communication_context_001",
      "communication_context_002",
      "support_context_001"
    ]
  },
  {
    "section_id": "current_experiences_and_concerns",
    "title": "Current Experiences",
    "description": "Capture current concerns, changes, stressors, and areas that may need follow-up.",
    "order_index": 4,
    "is_required": true,
    "entry_prompt": "Now I’ll ask about what things have been like recently.",
    "closing_prompt": "Thank you. We can review this together before moving on.",
    "summary_enabled": true,
    "question_ids": [
      "current_concerns_001",
      "current_concerns_002",
      "current_concerns_003"
    ]
  },
  {
    "section_id": "health_and_history",
    "title": "Health And History",
    "description": "Placeholder section for health, history, and background items that may later be refined by the clinical team.",
    "order_index": 5,
    "is_required": false,
    "entry_prompt": "There are a few background questions that may help provide context.",
    "closing_prompt": "Thanks. We can skip anything that doesn’t fit or come back later.",
    "summary_enabled": true,
    "question_ids": [
      "health_history_001",
      "health_history_002"
    ]
  },
  {
    "section_id": "review_and_close",
    "title": "Review",
    "description": "Review what was captured, identify any skipped items, and allow corrections.",
    "order_index": 6,
    "is_required": true,
    "entry_prompt": "We’re almost done. Let’s review what I captured.",
    "closing_prompt": "Thanks. Your intake is ready for review.",
    "summary_enabled": false,
    "question_ids": [
      "review_001"
    ]
  }
]
```

### Sample `question_definition` Objects

```json
[
  {
    "question_id": "answer_mode_001",
    "section_id": "intro_and_preferences",
    "prompt_text": "Who is answering the intake today?",
    "plain_language_variant": "Who will be answering questions today?",
    "short_variant": "Who is answering today?",
    "example_starters": [
      "I am answering for myself",
      "I’m here with someone supporting me",
      "We are answering together"
    ],
    "help_text": "This helps me phrase questions in a way that fits who is answering.",
    "response_type": "single_select",
    "is_mandatory_core": true,
    "is_skippable": false,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": false,
    "followup_rule_ids": [],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "input_mode_001",
    "section_id": "intro_and_preferences",
    "prompt_text": "How would you like to do this intake?",
    "plain_language_variant": "What kind of input works best for you right now?",
    "short_variant": "How would you like to answer?",
    "example_starters": [
      "Typing works best",
      "I’d like to speak",
      "I want both options"
    ],
    "help_text": "You can change this later.",
    "response_type": "single_select",
    "is_mandatory_core": true,
    "is_skippable": false,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": false,
    "followup_rule_ids": [],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "reason_for_intake_001",
    "section_id": "reason_for_intake",
    "prompt_text": "What feels most important for us to understand about why you are doing this intake right now?",
    "plain_language_variant": "What feels important to share about why you are here right now?",
    "short_variant": "What feels most important to share right now?",
    "example_starters": [
      "Something has changed recently",
      "I’m looking for support",
      "I want someone to understand what has been hard"
    ],
    "help_text": "You can answer in your own words, skip, or come back later.",
    "response_type": "free_text",
    "is_mandatory_core": true,
    "is_skippable": true,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": true,
    "followup_rule_ids": [
      "reason_for_intake_missing_context"
    ],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "reason_for_intake_002",
    "section_id": "reason_for_intake",
    "prompt_text": "Has anything changed recently that made this feel more important now?",
    "plain_language_variant": "Did something change recently that made this feel more important?",
    "short_variant": "Has something changed recently?",
    "example_starters": [
      "Yes, something has changed",
      "No, this has been ongoing",
      "I’m not sure"
    ],
    "help_text": "A short answer is fine.",
    "response_type": "free_text",
    "is_mandatory_core": false,
    "is_skippable": true,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": true,
    "followup_rule_ids": [],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "communication_context_001",
    "section_id": "communication_and_support_context",
    "prompt_text": "What helps communication feel easier or clearer for you?",
    "plain_language_variant": "What helps people communicate with you in a way that works better?",
    "short_variant": "What helps communication work better for you?",
    "example_starters": [
      "Shorter questions help",
      "I need more time to answer",
      "It helps when things are written down"
    ],
    "help_text": "This can include pacing, wording, speech, typing, or anything else that helps.",
    "response_type": "free_text",
    "is_mandatory_core": true,
    "is_skippable": true,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": true,
    "followup_rule_ids": [],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "support_context_001",
    "section_id": "communication_and_support_context",
    "prompt_text": "Is anyone supporting you with this intake today, or in day-to-day life in a way that feels important to mention?",
    "plain_language_variant": "Is there anyone helping with this intake or with daily support that you want us to know about?",
    "short_variant": "Is anyone supporting you in a way that feels important to mention?",
    "example_starters": [
      "I’m doing this on my own",
      "Someone is helping me today",
      "I have regular support in daily life"
    ],
    "help_text": "You can keep this brief.",
    "response_type": "free_text",
    "is_mandatory_core": false,
    "is_skippable": true,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": true,
    "followup_rule_ids": [],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "current_concerns_001",
    "section_id": "current_experiences_and_concerns",
    "prompt_text": "What has felt most difficult, stressful, or important lately?",
    "plain_language_variant": "What has been hardest or most important lately?",
    "short_variant": "What has felt most difficult lately?",
    "example_starters": [
      "Stress has been higher lately",
      "Daily life has felt harder",
      "There have been changes that are hard to manage"
    ],
    "help_text": "You can answer in your own words.",
    "response_type": "free_text",
    "is_mandatory_core": true,
    "is_skippable": true,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": true,
    "followup_rule_ids": [
      "current_concerns_missing_impact"
    ],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "current_concerns_002",
    "section_id": "current_experiences_and_concerns",
    "prompt_text": "Have there been any recent changes in routines, stress, health, support, or environment that feel connected to this?",
    "plain_language_variant": "Have any changes happened recently that seem connected to this?",
    "short_variant": "Have there been recent changes that feel connected?",
    "example_starters": [
      "A routine changed",
      "Support changed",
      "My environment changed"
    ],
    "help_text": "You can say as much or as little as you want.",
    "response_type": "free_text",
    "is_mandatory_core": false,
    "is_skippable": true,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": true,
    "followup_rule_ids": [],
    "clinical_owner_status": "draft"
  },
  {
    "question_id": "review_001",
    "section_id": "review_and_close",
    "prompt_text": "Would you like to review, edit, or add anything before finishing?",
    "plain_language_variant": "Do you want to change or add anything before we finish?",
    "short_variant": "Anything to review or add?",
    "example_starters": [
      "I want to review something",
      "I want to add something",
      "No, I’m ready to finish"
    ],
    "help_text": "You can go back to any section.",
    "response_type": "free_text",
    "is_mandatory_core": true,
    "is_skippable": false,
    "allow_rephrase": true,
    "allow_examples": true,
    "allow_summary": false,
    "followup_rule_ids": [],
    "clinical_owner_status": "draft"
  }
]
```

### Example `followup_rule` Objects

```json
[
  {
    "followup_rule_id": "reason_for_intake_missing_context",
    "parent_question_id": "reason_for_intake_001",
    "trigger_type": "missing_required_detail",
    "trigger_condition": "response_is_too_brief_to_identify_reason",
    "followup_question_id": "reason_for_intake_followup_001",
    "max_followups": 1
  },
  {
    "followup_rule_id": "current_concerns_missing_impact",
    "parent_question_id": "current_concerns_001",
    "trigger_type": "missing_required_detail",
    "trigger_condition": "response_mentions_difficulty_without_context_or_impact",
    "followup_question_id": "current_concerns_followup_001",
    "max_followups": 1
  }
]
```

### Frontend Screen Flow For V1

The typed-first v1 frontend should be built around a small number of screens or views.

#### 1. Welcome And Consent Context

Purpose:

- orient the user
- explain what the intake is
- clarify that questions can be skipped
- explain that preferences can be changed at any time

#### 2. Entry Mode And Preferences

Purpose:

- capture who is answering
- capture input mode and adaptation preferences
- reduce friction before the first content section

#### 3. Question View

Purpose:

- present one question at a time
- keep the screen uncluttered
- offer in-context actions

Core controls:

- answer
- skip
- rephrase
- example
- repeat
- change preferences
- pause

#### 4. Section Summary View

Purpose:

- show what was captured
- allow correction before advancing
- maintain transparency around structured capture

#### 5. Review And Edit View

Purpose:

- review completed sections
- show skipped items and open items
- allow navigation back into the intake

#### 6. Completion View

Purpose:

- confirm completion
- explain what happens next
- show that the intake was captured successfully

### Frontend Interaction Notes

The v1 frontend should default to:

- one-question-at-a-time layout
- low visual clutter
- obvious progress without pressure
- persistent access to preference controls
- visible confirmation before moving past summaries

The frontend should not assume that accessibility settings live in a separate preferences page only.

## Suggested Immediate Engineering Tasks

Based on the current draft, engineering can now:

- represent sections and questions as JSON-backed configuration
- implement the state machine with placeholder sections
- build a basic text-first question screen
- implement skip, rephrase, example, and summary actions
- persist `response_record` and `report_payload` objects
- add a lightweight preference panel tied to `interaction_preferences`

## Suggested Immediate Product And Clinical Review Tasks

- review whether the placeholder sections feel directionally right
- review whether the draft wording is neuroaffirming enough for placeholder use
- identify which placeholder questions should become real core questions first
- flag any wording or structure that should not be carried forward

## V1 State Machine

The v1 intake engine should use a simple deterministic state machine.

Suggested flow:

1. `start_session`
2. `select_answer_mode`
3. `capture_preferences`
4. `enter_section`
5. `ask_core_question`
6. `handle_response`
7. `offer_clarify_or_rephrase_if_needed`
8. `ask_followup_if_rule_matches`
9. `summarize_section`
10. `confirm_and_advance`
11. `review_remaining_items`
12. `complete_session`

Supported user actions at any question:

- answer
- skip
- pause
- ask for rephrase
- ask for example
- ask to repeat
- change preferences

### State Machine Guardrails

The engine should enforce:

- no advancement without recording either an answer or a skip for mandatory core questions
- no more than a bounded number of clarification attempts
- no follow-up questions unless triggered by an approved rule
- no silent tone or pace changes without user input
- no generated summaries advancing the intake unless the user can correct them

## Draft Question Schema Example

```json
{
  "question_id": "reason_for_intake_001",
  "section_id": "reason_for_intake",
  "prompt_text": "What would you like us to understand about why you are doing this intake right now?",
  "plain_language_variant": "What feels important to share about why you are here today?",
  "short_variant": "Why are you doing this intake right now?",
  "example_starters": [
    "Something has changed recently",
    "I want support with day-to-day life",
    "Someone suggested I do this intake"
  ],
  "help_text": "You can answer in your own words. You can also skip this and come back later.",
  "response_type": "free_text",
  "is_mandatory_core": true,
  "is_skippable": true,
  "allow_rephrase": true,
  "allow_examples": true,
  "allow_summary": true,
  "followup_rule_ids": [
    "reason_for_intake_missing_context"
  ],
  "clinical_owner_status": "draft"
}
```

## LLM Integration Contract For Later Mac Studio Use

The future local Mac Studio-hosted model should plug into the intake engine through a narrow interface.

The model should receive:

- the current approved question definition
- the current interaction preferences
- the answer mode
- recent confirmed user responses
- allowed action type

The model should return one of a small set of controlled outputs:

- `render_question`
- `render_rephrase`
- `render_example_starters`
- `render_brief_summary`
- `render_acknowledgement`

The model should not return:

- next-question decisions
- new question content
- scoring decisions
- clinical interpretations
- diagnostic suggestions

This interface keeps the eventual Mac Studio integration useful and powerful without making the LLM the system’s decision-maker.

## Conversational Voice Mode Feasibility

It is feasible to build a conversational multimodal mode where:

- the user speaks naturally
- the local LLM responds conversationally
- the system extracts and maps the user’s answers into structured intake fields
- the captured information populates a report for pre-assessment screening

However, this should not be implemented as one free-form conversation with a report generated afterward from memory alone.

The safer architecture is:

1. speech input is transcribed
2. the orchestrator identifies the active approved question
3. the LLM generates a conversational response within allowed boundaries
4. a structured extraction step maps the user’s answer into the current intake field
5. the system shows or reads back what was captured for confirmation
6. confirmed content is saved into the report payload

### Why This Is Feasible

This is feasible because the problem can be separated into controllable pieces:

- speech-to-text
- conversational rendering
- structured field extraction
- confirmation and correction
- report generation

Each piece can be tested independently, and the LLM does not need to manage the full assessment logic alone.

### What Makes It Hard

The hard part is not whether the model can talk. The hard part is making sure conversational speech still produces reliable structured intake data.

Main risks:

- users answering multiple questions at once
- users speaking in nonlinear ways
- the model over-summarizing or miscapturing details
- speech recognition errors
- caregiver and participant voices getting mixed together
- conversational drift away from approved intake content

### Recommended Voice-Mode Architecture

If voice mode is added, it should still remain question-anchored.

That means:

- one current intake target is always active
- each spoken answer is attached to a specific question or follow-up
- the system extracts structured content immediately after each answer
- the user gets a chance to confirm or correct what was captured
- the report is built incrementally, not reconstructed only at the end

### Bottom-Line Recommendation For V1

For v1, build the intake engine so that voice conversation can plug in later, but do not make full live voice mode the critical path unless it is essential for the prototype.

The best v1 path is:

- build text-first with strong preference controls
- support read-aloud early
- design response capture and report population as structured events
- add live conversational voice once the intake schema and confirmation flow are stable

That gives you a realistic path to something similar in spirit to ChatGPT voice mode, while still producing a dependable pre-assessment report.

## Frontend Recommendation

The frontend should be multimodal, adjustable, and intentionally low-stimulation. It should align with the spirit of Apple’s Human Interface Guidelines and accessibility principles.

### Essential Interaction Modes

- typed input
- spoken input
- read-aloud output
- visible text output
- replay and repetition controls

### Essential Accessibility And Adaptation Features

- adjustable text size
- contrast and theme options
- reduced motion mode
- slower pacing mode
- one-question-at-a-time layout
- explicit progress indicators that do not create pressure
- clear actions for repeat, rephrase, example, skip, and come back later
- low-clutter visual design
- confirmation before moving forward when needed

These are not cosmetic additions. They are part of how the tool becomes safe and usable for different people.

### Frontend Technology Direction

Best native-fit option:

- `SwiftUI` for strong Apple-platform accessibility behavior

Alternative if team velocity is better there:

- `React`, with the understanding that making it feel truly native and accessibility-first will take more deliberate effort

## Multimodal And Speech Strategy

The M3 Ultra is especially useful for local speech and multimodal prototyping.

Recommended path:

- start with Apple `Speech` framework for native speech recognition
- compare against MLX-based Whisper-style local transcription where needed
- use text-to-speech for read-aloud prompts
- design for interruptibility and replay
- explore domain vocabulary boosting for autism-related and assessment-related terminology

This lets us support:

- spoken answers
- typed fallback or default input
- low-latency turn-taking
- accessible read-aloud prompting

## Model Strategy By Phase

### Phase 1: Constrained Prototype

Use a strong local open model with retrieval and prompt constraints.

Goals:

- prove the interaction design
- prove the question flow
- test summaries and clarifications
- evaluate neuroaffirming phrasing
- collect early study data

### Phase 2: Targeted Fine-Tuning

Create a dataset from:

- ideal assistant turns
- acceptable clarifications
- neuroaffirming rephrasings
- examples of disallowed language or behavior
- modality-aware prompt variants

Then do lightweight supervised fine-tuning or adapter training.

### Phase 3: Distillation And Deployment Readiness

Distill toward a smaller, faster, more controllable model suitable for deployment.

Goals:

- lower latency
- lower hardware requirements
- better controllability
- easier productionization

## What The M3 Ultra Specifically Enables

### Strong Fit

- local inference with reasonably large open models
- local retrieval and indexing
- rapid prompt and policy iteration
- transcript analysis at scale
- side-by-side model and prompt evaluation
- private demos without cloud dependency
- lightweight fine-tuning or adapter work
- local speech pipelines for multimodal testing

### Poor Fit

- training a serious foundation model from scratch
- relying on hardware alone to solve product quality
- using one giant model as the whole product architecture

The leverage is in system design, not brute force.

## Important Product Constraints

### Do Not

- do not start by “training on everything”
- do not let the model choose the assessment flow
- do not treat voice as the only important modality
- do not build a generic chatbot experience
- do not collapse knowledge, policy, and UI behavior into one opaque model

### Do

- keep the question flow constrained and researchable
- make accessibility controls available from day one
- preserve auditability between source material and model behavior
- optimize for safety, clarity, and low-friction interaction
- collect structured examples that support future validation and tuning

## Highest-Leverage Next Steps

Over the next month, the highest-leverage work is:

1. Stand up a local LLM stack on the M3 Ultra.
2. Build a constrained question-flow engine.
3. Create a small internal knowledge base for neuroaffirming phrasing and assessment guidance.
4. Add typed and spoken input paths.
5. Add accessibility controls directly into the core UI.
6. Run transcript-based evaluations locally.
7. Start collecting high-quality examples for fine-tuning.

## Bottom Line

The M3 Ultra is absolutely strong enough to be the development hub for this project.

We should use it to:

- run local models
- prototype multimodal interaction
- evaluate conversation quality
- build a constrained autism pre-assessment agent
- prepare a clean path toward fine-tuning and eventual deployment

The smartest architecture is:

`RAG + controlled dialogue flow + local speech + adaptive frontend`

Not:

`one custom-trained mega-model`
