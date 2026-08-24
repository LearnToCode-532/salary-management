# ACME Salary Management — AI-Assisted Development Approach

## 1. Purpose

AI is an integral part of the development workflow for this project.

The objective is to use AI to:

- Accelerate development.
- Explore design alternatives.
- Generate implementation scaffolding.
- Improve test coverage.
- Identify potential bugs.
- Review code for maintainability and performance.
- Assist with debugging.
- Improve documentation.

AI-generated output is treated as a suggestion and is reviewed before being accepted into the codebase.

The developer remains responsible for the final implementation and engineering decisions.

---

# 2. AI Development Principles

The project follows below principles:

1. Understand the requirement before prompting AI.
2. Give AI enough project context to produce relevant output.
3. Prefer small, focused AI tasks over large autonomous changes.
4. Review generated code before committing it.
5. Validate behavior through tests and manual verification.

The workflow is:

```text
Requirement
    ↓
Design
    ↓
Focused AI Prompt
    ↓
Generated Suggestion
    ↓
Developer Review
    ↓
Tests
    ↓
Manual Verification
    ↓
Commit