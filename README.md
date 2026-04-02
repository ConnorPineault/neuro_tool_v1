# neuro_tool_v1

Using the LLM, report is built from structured data, not chat memory
thats important


So we got this front end 

when we get apple computers - we plug them into the backend for
The M3 Ultra helps mainly:

private local inference
no per-call API cost while iterating
better control over sensitive intake content
fast local experiments with rephrasing/summaries/extraction
a path to workshop demos without depending entirely on cloud AI

improves:
privacy
iteration speed
controllability
cost structure


Something to think about is the TTS/SST is this done by AI, or is it standard tts? 
I want it to be done by the model

LLM: language generation, rephrasing, summaries, extraction
STT: audio to text
TTS: text to speech
intake engine: decides what happens next








intake system
controled deterministic progression
AI integration for rephrasing, help with questions TTS, SST and report generation 

once assessment is filled, generate report using Local LLM RAG trained on clincial data - assessments etc.

Give report to clinican 

Give resources to patient




QUESTION LOOP/FLOW
Core Loop For One Question

Backend determines the active question.
Backend requests rendered wording from the LLM if needed.
Frontend displays that wording.
If user taps Read, TTS path is triggered.
If user taps mic, STT path is triggered.
Transcript is returned and placed into the editable text field.
User edits or accepts it.
User submits.
Backend stores:
raw transcript if available
final edited answer
response metadata
Backend may call LLM for:
acknowledgement
summary
extraction
repeat until done