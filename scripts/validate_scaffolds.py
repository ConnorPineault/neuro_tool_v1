#!/usr/bin/env python3

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCAFFOLD_DIR = ROOT / "scaffolds"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_unique_ids(items, key, label, errors):
    seen = set()
    for item in items:
        value = item.get(key)
        if not value:
            errors.append(f"{label} is missing required key `{key}`: {item}")
            continue
        if value in seen:
            errors.append(f"Duplicate {label} id `{value}`")
            continue
        seen.add(value)


def main():
    sections = load_json(SCAFFOLD_DIR / "sections.v1.json")
    questions = load_json(SCAFFOLD_DIR / "questions.v1.json")
    followups = load_json(SCAFFOLD_DIR / "followups.v1.json")
    preferences = load_json(SCAFFOLD_DIR / "interaction_preferences.v1.json")

    errors = []

    validate_unique_ids(sections, "section_id", "section", errors)
    validate_unique_ids(questions, "question_id", "question", errors)
    validate_unique_ids(followups, "followup_rule_id", "followup", errors)

    section_ids = {section["section_id"] for section in sections if "section_id" in section}
    question_ids = {question["question_id"] for question in questions if "question_id" in question}
    followup_ids = {followup["followup_rule_id"] for followup in followups if "followup_rule_id" in followup}

    for section in sections:
        for question_id in section.get("question_ids", []):
            if question_id not in question_ids:
                errors.append(
                    f"Section `{section['section_id']}` references missing question `{question_id}`"
                )

    for question in questions:
        section_id = question.get("section_id")
        if section_id not in section_ids:
            errors.append(
                f"Question `{question.get('question_id')}` references missing section `{section_id}`"
            )

        if question.get("response_type") == "single_select" and not question.get("response_options"):
            errors.append(
                f"Question `{question.get('question_id')}` is `single_select` but has no `response_options`"
            )

        for followup_id in question.get("followup_rule_ids", []):
            if followup_id not in followup_ids:
                errors.append(
                    f"Question `{question.get('question_id')}` references missing follow-up rule `{followup_id}`"
                )

    for followup in followups:
        parent_question_id = followup.get("parent_question_id")
        followup_question_id = followup.get("followup_question_id")

        if parent_question_id not in question_ids:
            errors.append(
                f"Follow-up `{followup.get('followup_rule_id')}` references missing parent question `{parent_question_id}`"
            )

        if followup_question_id not in question_ids:
            errors.append(
                f"Follow-up `{followup.get('followup_rule_id')}` references missing follow-up question `{followup_question_id}`"
            )

    defaults = preferences.get("defaults", {})
    options = preferences.get("options", {})
    for key, allowed in options.items():
        value = defaults.get(key)
        if value is not None and value not in allowed:
            errors.append(
                f"Preference default `{key}={value}` is not present in allowed options {allowed}"
            )

    if errors:
        print("Scaffold validation failed:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Scaffold validation passed.")
    print(f"Sections: {len(sections)}")
    print(f"Questions: {len(questions)}")
    print(f"Follow-up rules: {len(followups)}")
    print(f"Preference option groups: {len(options)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
